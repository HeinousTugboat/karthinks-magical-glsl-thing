const { getDefaultConfig } = require('metro-config');

const importedFileTypes = [
  'md',
  'text',
  'txt',
  'frag',
  'vert',
  'geom',
  'comp',
  'mesh',
  'task'
]

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  return {
    resolver: {
      assetExts: assetExts.filter(ext => !importedFileTypes.includes(ext)),
      sourceExts: [...sourceExts, ...importedFileTypes]
    }
  };
})();
