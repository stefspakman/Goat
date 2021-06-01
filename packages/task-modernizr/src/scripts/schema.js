module.exports = {
  id: '/Modernizr',
  type: 'object',
  properties: {
    locations: {
      type: 'object',
      properties: {
        styles: {
          type: 'object',
          properties: {
            src: {
              type: 'string',
              default: 'components/',
            },
            dist: {
              type: 'string',
              default: 'css/',
            },
          },
          required: ['src'],
        },
        javascript: {
          type: 'object',
          properties: {
            src: {
              type: 'array',
              default: ['components'],
            },
            libraries: {
              type: 'string',
              default: 'js/libraries/',
            },
          },
          required: ['src', 'libraries'],
        },
      },
      required: ['javascript', 'styles'],
    },
    js: {
      type: 'object',
      properties: {
        minify: {
          type: 'boolean',
          default: false,
        },
        modernizr: {
          type: 'object',
          properties: {
            include: {
              type: 'array',
              default: ['inputtypes'],
            },
            exclude: {
              type: 'array',
              default: ['hidden'],
            },
          },
          required: ['include', 'exclude'],
        },
      },
      required: ['modernizr'],
    },
  },
  required: ['locations', 'js'],
};
