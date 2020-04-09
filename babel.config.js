module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
          'inline-import',
          {
              'extensions': [
                  '.md',
                  '.text',
                  '.txt',
                  '.frag',
                  '.vert',
                  '.geom',
                  '.comp',
                  '.mesh',
                  '.task'
                ]
          }
      ],
      [
          'module-resolver',
          {
              'root': ['.'],
              'alias': {}
          }
      ]
  ]
  };
};
