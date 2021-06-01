function createAttributes(attributes) {
  return Object.entries(attributes).reduce((result, { 0: attribute, 1: value }) => (`${result} ${attribute}="${value}";`), '');
}

module.exports = createAttributes;
