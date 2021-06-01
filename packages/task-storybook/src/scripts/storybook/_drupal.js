/**
 * Simple Drupal.behaviors usage for Storybook
 */

// eslint-disable-next-line no-undef
window.Drupal = { behaviors: {} };

(function (Drupal, drupalSettings) {
  // eslint-disable-next-line no-param-reassign
  Drupal.throwError = function throwError(error) {
    setTimeout(() => {
      throw error;
    }, 0);
  };

  // eslint-disable-next-line no-param-reassign
  Drupal.attachBehaviors = function attachBehaviors(context, settings) {
    // eslint-disable-next-line no-undef,no-param-reassign
    context = context || document;
    // eslint-disable-next-line no-param-reassign
    settings = settings || drupalSettings;
    const { behaviors } = Drupal;

    Object.keys(behaviors).forEach((i) => {
      if (typeof behaviors[i].attach === 'function') {
        try {
          behaviors[i].attach(context, settings);
        } catch (e) {
          Drupal.throwError(e);
        }
      }
    });
  };
// eslint-disable-next-line no-undef
}(Drupal, window.drupalSettings));
