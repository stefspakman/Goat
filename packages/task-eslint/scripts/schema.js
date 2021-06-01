module.exports = {
  id: '/ESlint',
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
          },
          required: ['src'],
        },
      },
      required: ['javascript'],
    },
    js: {
      type: 'object',
      properties: {
        eslint: {
          type: 'object',
          properties: {
            es6: {
              type: 'boolean',
              default: true,
            },
            config: {
              type: 'object',
              default: {
                rules: {
                  'no-console': 'error',
                  'no-debugger': 'error',
                },
              },
            },
          },
        },
      },
    },
  },
  required: [
    'browserSupport',
    'locations',
    'js',
  ],
};
