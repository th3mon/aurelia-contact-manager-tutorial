import {WebAPI} from './web-api';

export class App {
  static inject() {
    return [WebAPI];
  }

  configureRouter (config, router) {
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
