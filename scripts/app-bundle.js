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
define('contact-list',['exports', './web-api'], function (exports, _webApi) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactList = undefined;
  class ContactList {
    static inject() {
      return [_webApi.WebAPI];
    }

    constructor(api) {
      this.api = api;
      this.contacts = [];
    }

    created() {
      this.api.getContactList().then(contacts => this.contacts = contacts);
    }

    select(contact) {
      this.selectedId = contact.id;
      return true;
    }
  }
  exports.ContactList = ContactList;
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
define('web-api',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  let latency = 200;
  let id = 0;

  function getId() {
    return ++id;
  }

  let contacts = [{
    id: getId(),
    firstName: 'John',
    lastName: 'Tolkien',
    email: 'tolkien@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Clive',
    lastName: 'Lewis',
    email: 'lewis@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Owen',
    lastName: 'Barfield',
    email: 'barfield@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Charles',
    lastName: 'Williams',
    email: 'williams@inklings.com',
    phoneNumber: '867-5309'
  }, {
    id: getId(),
    firstName: 'Roger',
    lastName: 'Green',
    email: 'green@inklings.com',
    phoneNumber: '867-5309'
  }];

  class WebAPI {
    // isRequesting = false;
    constructor() {
      this.isRequesting = false;
    }

    getContactList() {
      this.isRequesting = true;
      return new Promise(resolve => {
        setTimeout(() => {
          let results = contacts.map(x => {
            return {
              id: x.id,
              firstName: x.firstName,
              lastName: x.lastName,
              email: x.email
            };
          });
          resolve(results);
          this.isRequesting = false;
        }, latency);
      });
    }

    getContactDetails(id) {
      this.isRequesting = true;
      return new Promise(resolve => {
        setTimeout(() => {
          let found = contacts.filter(x => x.id == id)[0];
          resolve(JSON.parse(JSON.stringify(found)));
          this.isRequesting = false;
        }, latency);
      });
    }

    saveContact(contact) {
      this.isRequesting = true;
      return new Promise(resolve => {
        setTimeout(() => {
          let instance = JSON.parse(JSON.stringify(contact));
          let found = contacts.filter(x => x.id == contact.id)[0];

          if (found) {
            let index = contacts.indexOf(found);
            contacts[index] = instance;
          } else {
            instance.id = getId();
            contacts.push(instance);
          }

          this.isRequesting = false;
          resolve(instance);
        }, latency);
      });
    }
  }
  exports.WebAPI = WebAPI;
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
define('contact-detail',['exports', './web-api', './utility'], function (exports, _webApi, _utility) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactDetail = undefined;
  class ContactDetail {
    static inject() {
      return [_webApi.WebAPI];
    }

    constructor(api) {
      this.api = api;
    }

    activate(params, routeConfig) {
      this.routeConfig = routeConfig;

      return this.api.getContactDetails(params.id).then(contact => {
        this.contact = contact;
        this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalContact = JSON.parse(JSON.stringify(contact));
      });
    }

    get canSave() {
      return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
    }

    save() {
      this.api.saveContact(this.contact).then(contact => {
        this.contact = contact;
        this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalContact = JSON.parse(JSON.stringify(contact));
      });
    }

    canDeactivate() {
      if (!(0, _utility.areEqual)(this.originalContact, this.contact)) {
        return confirm('You have unsaved changes. Are you sure you wish to leave?');
      }

      return true;
    }
  }
  exports.ContactDetail = ContactDetail;
});
define('test',[], function () {
  "use strict";
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\n    <require from=\"./styles.css\"></require>\n    <require from=\"./contact-list\"></require>\n\n    <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n        <div class=\"navbar-header\">\n            <a class=\"navbar-brand\" href=\"#\">\n                <i class=\"fa fa-user\"></i>\n                <span>Contacts</span>\n            </a>\n        </div>\n    </nav>\n\n    <div class=\"container\">\n        <div class=\"row\">\n            <contact-list class=\"col-md-4\"></contact-list>\n            <router-view class=\"col-md-8\"></router-view>\n        </div>\n    </div>\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"contact-list\">\n    <ul class=\"list-group\">\n      <li repeat.for=\"contact of contacts\" class=\"list-group-item ${contact.id === $parent.selectedId ? 'active' : ''}\">\n        <a route-href=\"route: contacts; params.bind: {id:contact.id}\" click.delegate=\"$parent.select(contact)\">\n          <h4 class=\"list-group-item-heading\">${contact.firstName} ${contact.lastName}</h4>\n          <p class=\"list-group-item-text\">${contact.email}</p>\n        </a>\n      </li>\n    </ul>\n  </div>\n</template>\n"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"no-selection text-center\">\n    <h2>${message}</h2>\n  </div>\n</template>\n"; });
define('text!contact-detail.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"panel panel-primary\">\n    <div class=\"panel-heading\">\n      <h3 class=\"panel-title\">Profile</h3>\n    </div>\n    <div class=\"panel-body\">\n      <form role=\"form\" class=\"form-horizontal\">\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">First Name</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"first name\" class=\"form-control\" value.bind=\"contact.firstName\">\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">Last Name</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"last name\" class=\"form-control\" value.bind=\"contact.lastName\">\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">Email</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"email\" class=\"form-control\" value.bind=\"contact.email\">\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">Phone Number</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"phone number\" class=\"form-control\" value.bind=\"contact.phoneNumber\">\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n\n  <div class=\"button-bar\">\n    <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map