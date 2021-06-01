import { JSONSchema6 } from 'json-schema';

const schema: JSONSchema6 = {
  type: 'object',
  properties: {
    locations: {
      type: 'object',
      properties: {
        dist: {
          type: 'string',
          default: 'dist',
        },
        patterns: {
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
              pattern: '**/!(*.stories|*.component|*.min|*.test).es6.js',
            },
            {
              directory: 'components',
              pattern: '**/!(*.stories|*.component|*.min|*.test).ts',
            },
            {
              directory: 'components',
              pattern: '**/!(*.stories|*.component|*.min|*.test|_*).scss',
            },
          ],
        },
      },
      required: ['patterns', 'dist'],
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
    handlers: {
      type: 'object',
      properties: {
        javascript: {
          type: 'boolean',
          default: true,
        },
        styles: {
          type: 'boolean',
          default: true,
        },
        assets: {
          type: 'boolean',
          default: true,
        },
      },
    },
    bundler: {
      type: 'object',
      properties: {
        clean: {
          type: 'boolean',
          default: true,
        },
        destination: {
          type: 'object',
          properties: {
            flat: {
              type: 'boolean',
              default: false,
            },
          },
        },
        js: {
          type: 'object',
          properties: {
            output: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  default: '[name].bundle.js',
                },
                publicpath: {
                  type: ['string', 'boolean'],
                  default: false,
                },
              },
            },
          },
          required: ['output'],
        },
      },
      required: ['clean', 'destination', 'js'],
    },
  },
  required: ['locations', 'bundler', 'styles', 'handlers'],
};

export default schema;
