module.exports = {
  id: '/Babel',
  type: 'object',
  properties: {
    browserSupport: {
      type: 'array',
      default: ['> 1%', 'last 2 versions'],
    },
    locations: {
      type: 'object',
      properties: {
        javascript: {
          type: 'object',
          properties: {
            src: {
              type: 'array',
              default: ['components'],
            },
            dist: {
              type: 'string',
              default: '<source>',
            },
          },
          required: ['src', 'dist'],
        },
      },
      required: ['javascript'],
    },
    js: {
      type: 'object',
      properties: {
        babel: {
          type: 'object',
          properties: {
            keep_path: {
              type: 'boolean',
              default: true,
            },
          },
          required: [
            'keep_path',
          ],
        },
      },
      required: [
        'babel',
      ],
    },
  },
  required: [
    'browserSupport',
    'locations',
    'js',
  ],
};
