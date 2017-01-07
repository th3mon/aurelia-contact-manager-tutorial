define('app',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class App {
        configureRouter(config, router) {
            config.title = 'Contacts';
            config.map([{
                route: '',
                moduleId: 'no-selection',
                title: 'Select'
            }, {
                route: 'contacts/:id',
                moduleId: 'contact-detail',
                name: 'contacts'
            }]);

            this.router = router;
        }
    }
    exports.App = App;
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  //Configure Bluebird Promises.
  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(() => aurelia.setRoot());
  }
});
define('utility',["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.areEqual = areEqual;
	function areEqual(obj1, obj2) {
		return Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
	};
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    //config.globalResources([]);
  }
});
define('no-selection',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class NoSelection {
        constructor() {
            this.message = 'Please Select Contact.';
        }
    }
    exports.NoSelection = NoSelection;
});
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\n    <require from=\"./styles.css\"></require>\n\n    <nav class=\"navbar navbar-default navbar-fixed-top\">\n        <div class=\"navbar-header\">\n            <a href=\"#\" class=\"navbar-brand\">\n                <i class=\"fa fa-user\"></i>\n                <span>\n                    Contacts\n                </span>\n            </a>\n        </div>\n    </nav>\n\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-md-4\">\n                Contact List Placeholder\n            </div>\n            <router-view class=\"col-md-8\"></router-view>\n        </div>\n    </div>\n</template>\n"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"no-selection text-center\">\n    <h2>${message}</h2>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map