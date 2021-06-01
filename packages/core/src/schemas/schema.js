module.exports = {
  id: '/Base',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    version: {
      $type: 'string',
    },
  },
  required: ['version'],
};
