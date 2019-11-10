module.exports = {
  id: '/Babel',
  type: 'object',
  properties: {
    browserSupport: {
      type: 'array'
    },
    locations: {
      type: 'object',
      properties: {
        javascript: {
          type: 'object',
          properties: {
            src: {
              type: 'array'
            }
          },
          required: ['src']
        }
      },
      required: ['javascript']
    },
  }
}