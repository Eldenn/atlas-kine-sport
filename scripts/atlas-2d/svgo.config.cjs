// svgo settings for the Atlas illustration (scripts/atlas-2d/build.sh). Whole units are enough:
// the drawing is 1536 units wide and never shown much wider than that.
module.exports = {
  floatPrecision: 0,
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: { overrides: { mergePaths: false, removeDesc: { removeAny: true } } },
    },
    'removeTitle',
    'removeDimensions',
    { name: 'removeAttrs', params: { attrs: 'aria-labelledby' } },
  ],
}
