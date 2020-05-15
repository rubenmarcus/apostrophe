// Provides the "raw HTML widget" (the `@apostrophecms/html` widget).
// Use of this widget is not recommended if it can be avoided. The
// improper use of HTML can easily break pages. If a page becomes
// unusable, add `?safe_mode=1` to the URL to make it work temporarily
// without the offending code being rendered.

let _ = require('lodash');

module.exports = {
  extend: '@apostrophecms/widget-type',
  options: { label: 'Raw HTML' },
  fields: {
    add: {
      code: {
        type: 'string',
        label: 'Raw HTML (Code)',
        textarea: true,
        help: 'Be careful when embedding third-party code, as it can break the website editing functionality. If a page becomes unusable, add "?safe_mode=1" to the URL to make it work temporarily without the problem code being rendered.'
      }
    }
  },
  init(self, options) {
    self.addHelper();
  },
  methods(self, options) {
    return {
      addHelper() {
        self.addHelpers({ safeRender: self.safeRender });
      },
      // needs to be a component? Needs access to req during rendering
      safeRender(code) {
        const req = self.apos.templates.contextReq;
        if (req.xhr) {
          return 'Refresh the page to view raw HTML.';
        }
        // Be understanding of the panic that is probably going on in a user's mind as
        // they try to remember how to use safe mode. -Tom
        const safeModeVariations = [
          'safemode',
          'safeMode',
          'safe_mode',
          'safe-mode',
          'safe mode'
        ];
        if (req.query) {
          let safe = false;
          _.each(safeModeVariations, function (variation) {
            if (_.has(req.query, variation)) {
              safe = true;
              return false;
            }
          });
          if (safe) {
            return 'Running in safe mode, not showing raw HTML.';
          }
        }
        return code;
      }
    };
  }
};