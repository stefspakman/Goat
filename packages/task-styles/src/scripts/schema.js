module.exports = {
  id: '/Styles',
  type: 'object',
  properties: {
    browserSupport: {
      type: 'array',
      default: ['> 1%', 'last 2 versions'],
    },
    locations: {
      type: 'object',
      properties: {
        node_modules: {
          type: 'string',
          default: './node_modules',
        },
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
          required: ['src', 'dist'],
        },
      },
      required: ['styles'],
    },
    styles: {
      type: 'object',
      properties: {
        minify: {
          type: 'boolean',
          default: false,
        },
        compass: {
          type: 'boolean',
          default: false,
        },
        exclude: {
          type: 'array',
          default: [],
        },
        sourceMaps: {
          type: 'object',
          properties: {
            generate: {
              type: 'boolean',
              default: true,
            },
            location: {
              type: 'string',
              default: '/',
            },
            loadMaps: {
              type: 'boolean',
              default: false,
            },
            identityMap: {
              type: 'boolean',
              default: false,
            },
            debug: {
              type: 'boolean',
              default: false,
            },
            addComment: {
              type: 'boolean',
              default: true,
            },
            includeContent: {
              type: 'boolean',
              default: true,
            },
            charset: {
              type: 'string',
              default: 'utf8',
            },
            destPath: {
              type: 'string',
              default: '',
            },
            sourceMappingUrlPrefix: {
              type: 'string',
              default: '',
            },
          },
        },
        pxToRem: {
          type: 'object',
          properties: {
            enabled: {
              type: 'boolean',
              default: false,
            },
            settings: {
              type: 'object',
              properties: {
                rootValue: {
                  type: 'number',
                  default: 16,
                },
                replace: {
                  type: 'boolean',
                  default: false,
                },
              },
            },
          },
        },
      },
      required: [
        'minify',
        'compass',
        'exclude',
        'sourceMaps',
        'pxToRem',
      ],
    },
  },
  required: [
    'browserSupport',
    'locations',
    'styles',
  ],
};
