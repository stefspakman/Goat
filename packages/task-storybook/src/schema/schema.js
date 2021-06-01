module.exports = {
  id: '/Stories',
  type: 'object',
  properties: {
    locations: {
      type: 'object',
      properties: {
        stories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              directory: {
                type: 'string',
              },
              pattern: {
                type: 'string',
              },
            },
            required: ['directory', 'pattern'],
          },
          default: [
            {
              directory: 'components',
              pattern: '**/*.stories.js',
            },
          ],
        },
      },
      required: ['stories'],
    },
    styles: {
      type: 'object',
      properties: {
        resources: {
          type: 'array',
          items: {
            type: 'string',
          },
          default: [
            'components/01-base/global.scss',
          ],
        },
      },
    },
    stories: {
      type: 'object',
      properties: {
        static: {
          type: 'string',
          default: '.goat/storybook',
        },
        namespaces: {
          type: 'object',
          properties: {
            base: {
              type: 'string',
              default: 'components/01-base',
            },
            atoms: {
              type: 'string',
              default: 'components/02-atoms',
            },
            molecules: {
              type: 'string',
              default: 'components/03-molecules',
            },
            organisms: {
              type: 'string',
              default: 'components/04-organisms',
            },
            templates: {
              type: 'string',
              default: 'components/05-templates',
            },
            pages: {
              type: 'string',
              default: 'components/06-pages',
            },
          },
        },
      },
      required: ['namespaces'],
    },
  },
  required: ['locations', 'styles', 'stories'],
};
