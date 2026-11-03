"""Sculpt the kneeling Atlas of the home page and bake it to public/3d/atlas-figure.bin.

The figure is a signed distance field: round cones for the limbs, ellipsoids for the muscle masses,
blended with a smooth minimum so it reads as one carved piece rather than a jointed mannequin. The
field is meshed with marching cubes, simplified, and the ambient occlusion of the field (globe and
floor included) is baked per vertex, so the browser lights it with a couple of lights and no shadow
maps.

Pose: the Farnese Atlas, on one knee, the globe resting on the shoulders and steadied by both hands,
the head bowed under the load. Units are metres, Y up, the figure faces +Z; its left is +X.

    python3 -m pip install numpy scikit-image trimesh fast-simplification
    python3 scripts/atlas-3d/sculpt.py

The globe is not in the mesh: the page draws it (src/components/atlas/atlas-scene.ts), at GLOBE.
"""

from __future__ import annotations

import json
import struct
import sys
from pathlib import Path

import fast_simplification
import numpy as np
import trimesh
from skimage import measure

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "3d" / "atlas-figure.bin"

# Keep in sync with src/components/atlas/atlas-scene.ts.
GLOBE_CENTER = np.array([0.0, 1.56, -0.24], dtype=np.float32)
GLOBE_RADIUS = 0.47

VOXEL = 0.0055
TARGET_FACES = 20_000


# --- primitives (vectorised over an (N, 3) array of points) ---------------------------------------


def v(*xyz: float) -> np.ndarray:
    return np.array(xyz, dtype=np.float32)


def round_cone(p, a, b, r1, r2):
    """Inigo Quilez's round cone: a capsule whose radius goes from r1 at a to r2 at b."""
    ba = b - a
    l2 = float(ba @ ba)
    rr = r1 - r2
    a2 = l2 - rr * rr
    il2 = 1.0 / l2
    pa = p - a
    y = pa @ ba
    z = y - l2
    xv = pa * l2 - y[:, None] * ba
    x2 = np.einsum("ij,ij->i", xv, xv)
    y2 = y * y * l2
    z2 = z * z * l2
    k = np.sign(rr) * rr * rr * x2
    out = (np.sqrt(x2 * a2 * il2) + y * rr) * il2 - r1
    m1 = np.sign(z) * a2 * z2 > k
    m2 = np.sign(y) * a2 * y2 < k
    out = np.where(m1, np.sqrt(x2 + z2) * il2 - r2, out)
    out = np.where(m2 & ~m1, np.sqrt(x2 + y2) * il2 - r1, out)
    return out


def ellipsoid(p, c, r, rot=None):
    """Approximate ellipsoid distance (bound), optionally rotated by a 3x3 matrix."""
    q = p - c
    if rot is not None:
        q = q @ rot
    k0 = np.linalg.norm(q / r, axis=1)
    k1 = np.linalg.norm(q / (r * r), axis=1)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)


def sphere(p, c, r):
    return np.linalg.norm(p - c, axis=1) - r


def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b * (1 - h) + a * h - k * h * (1 - h)


def rot_x(deg):
    t = np.radians(deg)
    c, s = np.cos(t), np.sin(t)
    return np.array([[1, 0, 0], [0, c, -s], [0, s, c]], dtype=np.float32)


def rot_z(deg):
    t = np.radians(deg)
    c, s = np.cos(t), np.sin(t)
    return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]], dtype=np.float32)


# --- the pose -------------------------------------------------------------------------------------

J = {
    # pelvis and spine, leaning forward under the load
    "pelvis": v(0.0, 0.55, 0.0),
    "waist": v(0.0, 0.72, 0.035),
    "chest": v(0.0, 0.93, 0.07),
    "neck0": v(0.0, 1.05, 0.06),
    "neck1": v(0.0, 1.11, 0.15),
    "head": v(0.0, 1.15, 0.215),
    # front leg (left, +X): foot planted, knee up
    "hipL": v(0.10, 0.53, 0.01),
    "kneeL": v(0.16, 0.57, 0.45),
    "ankleL": v(0.15, 0.095, 0.40),
    "heelL": v(0.15, 0.035, 0.36),
    "toeL": v(0.17, 0.03, 0.56),
    # back leg (right, -X): knee on the ground, shin flat behind
    "hipR": v(-0.10, 0.53, 0.0),
    "kneeR": v(-0.15, 0.065, 0.11),
    "ankleR": v(-0.13, 0.085, -0.32),
    "toeR": v(-0.13, 0.025, -0.44),
    # arms up, hands on the globe
    "shoulderL": v(0.205, 1.035, 0.045),
    "elbowL": v(0.36, 1.17, 0.2),
    "wristL": v(0.39, 1.38, 0.02),
    "shoulderR": v(-0.205, 1.035, 0.045),
    "elbowR": v(-0.37, 1.18, 0.18),
    "wristR": v(-0.39, 1.39, 0.0),
}


def body(p: np.ndarray) -> np.ndarray:
    k = 0.05
    d = ellipsoid(p, J["pelvis"], v(0.155, 0.105, 0.115))
    d = smin(d, ellipsoid(p, J["waist"], v(0.125, 0.14, 0.095)), k)
    d = smin(d, ellipsoid(p, J["chest"], v(0.165, 0.165, 0.115), rot_x(-12)), k)
    # back: lats and the upper back the globe sits on
    d = smin(d, ellipsoid(p, v(0.0, 0.92, 0.0), v(0.19, 0.15, 0.10), rot_x(-12)), k)
    # pectorals
    for s in (1, -1):
        d = smin(d, ellipsoid(p, v(0.075 * s, 0.965, 0.13), v(0.085, 0.06, 0.045), rot_x(-15)), 0.04)
    # abdomen, a slightly rounded front
    d = smin(d, ellipsoid(p, v(0.0, 0.74, 0.085), v(0.085, 0.12, 0.05)), 0.03)
    # trapezius and neck
    d = smin(d, round_cone(p, v(0.0, 1.06, 0.0), J["shoulderL"], 0.06, 0.05), k)
    d = smin(d, round_cone(p, v(0.0, 1.06, 0.0), J["shoulderR"], 0.06, 0.05), k)
    d = smin(d, round_cone(p, J["neck0"], J["neck1"], 0.055, 0.047), 0.03)
    # head, bowed; a jaw so the profile is not an egg
    d = smin(d, ellipsoid(p, J["head"], v(0.072, 0.09, 0.083), rot_x(40)), 0.03)
    d = smin(d, ellipsoid(p, v(0.0, 1.095, 0.245), v(0.05, 0.042, 0.055), rot_x(40)), 0.03)

    for s, side in ((1, "L"), (-1, "R")):
        sh, el, wr = J["shoulder" + side], J["elbow" + side], J["wrist" + side]
        # deltoid
        d = smin(d, ellipsoid(p, sh + v(0.02 * s, 0.01, 0.0), v(0.068, 0.068, 0.068)), 0.04)
        # upper arm and biceps
        d = smin(d, round_cone(p, sh, el, 0.056, 0.041), 0.03)
        mid = sh * 0.45 + el * 0.55
        d = smin(d, ellipsoid(p, mid + v(0.0, 0.0, 0.015), v(0.044, 0.06, 0.042)), 0.035)
        # forearm
        d = smin(d, round_cone(p, el, wr, 0.046, 0.03), 0.025)
        d = smin(d, ellipsoid(p, el * 0.7 + wr * 0.3, v(0.04, 0.058, 0.04)), 0.035)
        # hand, flat against the globe
        to_globe = GLOBE_CENTER - wr
        to_globe /= np.linalg.norm(to_globe)
        palm = wr + to_globe * 0.03 + v(0.0, 0.055, 0.0)
        d = smin(d, ellipsoid(p, palm, v(0.03, 0.065, 0.048)), 0.02)

        hip = J["hip" + side]
        kn = J["knee" + side]
        an = J["ankle" + side]
        # glute
        d = smin(d, ellipsoid(p, v(0.075 * s, 0.53, -0.065), v(0.085, 0.09, 0.075)), 0.03)
        # thigh and quadriceps
        d = smin(d, round_cone(p, hip, kn, 0.088, 0.05), k)
        q = hip * 0.45 + kn * 0.55
        d = smin(d, ellipsoid(p, q, v(0.068, 0.068, 0.068)), 0.05)
        # shin and calf
        d = smin(d, round_cone(p, kn, an, 0.05, 0.032), 0.03)
        calf = kn * 0.65 + an * 0.35
        d = smin(d, ellipsoid(p, calf, v(0.046, 0.046, 0.046)), 0.045)

    # feet
    d = smin(d, round_cone(p, J["heelL"], J["toeL"], 0.034, 0.024), 0.025)
    d = smin(d, round_cone(p, J["ankleR"] + v(0, -0.03, -0.02), J["toeR"], 0.03, 0.022), 0.025)
    return d


def world(p: np.ndarray) -> np.ndarray:
    """Everything that occludes light: the figure, the globe and the floor."""
    d = body(p)
    d = np.minimum(d, sphere(p, GLOBE_CENTER, GLOBE_RADIUS))
    d = np.minimum(d, p[:, 1])
    return d


# --- mesh -------------------------------------------------------------------------------------------


def field_on_grid():
    lo = v(-0.62, -0.02, -0.62)
    hi = v(0.62, 1.6, 0.68)
    n = np.ceil((hi - lo) / VOXEL).astype(int) + 1
    xs = lo[0] + np.arange(n[0], dtype=np.float32) * VOXEL
    ys = lo[1] + np.arange(n[1], dtype=np.float32) * VOXEL
    zs = lo[2] + np.arange(n[2], dtype=np.float32) * VOXEL
    vol = np.empty(n, dtype=np.float32)
    yy, zz = np.meshgrid(ys, zs, indexing="ij")
    plane = np.stack([np.zeros_like(yy), yy, zz], axis=-1).reshape(-1, 3)
    for i, x in enumerate(xs):
        plane[:, 0] = x
        vol[i] = body(plane).reshape(n[1], n[2])
    return vol, lo


def field_normals(points, eps=0.004):
    """Normals from the gradient of the field: smoother than the faceted mesh's."""
    g = np.zeros_like(points)
    for axis in range(3):
        o = np.zeros(3, dtype=np.float32)
        o[axis] = eps
        g[:, axis] = body(points + o) - body(points - o)
    return g / np.maximum(np.linalg.norm(g, axis=1, keepdims=True), 1e-8)


def bake_ao(points, normals):
    """Five-tap SDF occlusion, with a little extra for creases."""
    occ = np.zeros(len(points), dtype=np.float32)
    w = 1.0
    for i in range(1, 7):
        h = 0.012 + 0.03 * i
        d = world(points + normals * h)
        occ += (h - np.minimum(d, h)) * w
        w *= 0.7
    return np.clip(1.0 - 2.6 * occ, 0.18, 1.0)


def main() -> int:
    vol, lo = field_on_grid()
    print("grid", vol.shape, file=sys.stderr)
    verts, faces, _, _ = measure.marching_cubes(vol, level=0.0, spacing=(VOXEL, VOXEL, VOXEL))
    verts = verts.astype(np.float32) + lo
    print("marching cubes", len(verts), "verts", len(faces), "faces", file=sys.stderr)

    ratio = 1.0 - TARGET_FACES / len(faces)
    verts, faces = fast_simplification.simplify(verts, faces.astype(np.int32), target_reduction=ratio)
    mesh = trimesh.Trimesh(verts, faces, process=True)
    # keep the largest piece only (stray specks from the blend)
    parts = mesh.split(only_watertight=False)
    mesh = max(parts, key=lambda m: len(m.faces))
    trimesh.smoothing.filter_taubin(mesh, iterations=12)
    print("simplified", len(mesh.vertices), "verts", len(mesh.faces), "faces", file=sys.stderr)

    pos = np.asarray(mesh.vertices, dtype=np.float32)
    nrm = field_normals(pos)
    ao = bake_ao(pos, nrm)
    idx = np.asarray(mesh.faces, dtype=np.uint16 if len(pos) < 65536 else np.uint32)

    bmin, bmax = pos.min(axis=0), pos.max(axis=0)
    qpos = np.round((pos - bmin) / (bmax - bmin) * 65535 - 32768).astype(np.int16)
    qnrm = np.round(np.clip(nrm, -1, 1) * 127).astype(np.int8)
    qao = np.round(ao * 255).astype(np.uint8)

    def pad4(b: bytes) -> bytes:
        return b + b"\0" * (-len(b) % 4)

    # Layout (little-endian): u32 vertexCount, u32 indexCount, f32[3] min, f32[3] max,
    # i16 positions (xyz), i8 normals (xyz), u8 occlusion, u16 indices; each block padded to 4 bytes.
    blob = struct.pack("<II6f", len(pos), idx.size, *bmin, *bmax)
    blob += pad4(qpos.tobytes()) + pad4(qnrm.tobytes()) + pad4(qao.tobytes()) + pad4(idx.astype("<u2").tobytes())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(blob)
    print(json.dumps({"file": str(OUT.relative_to(ROOT)), "bytes": len(blob), "min": bmin.tolist(), "max": bmax.tolist()}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
