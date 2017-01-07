import {WebAPI} from './web-api';
import {areEqual} from './utility';

export class ContactDetail {
  static inject () {
    return [WebAPI];
  }

  constructor (api) {
    this.api = api;
  }

  activate (params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getContactDetails(params.id)
      .then(contact => {
        this.contact = contact;
        this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalContact = JSON.parse(JSON.stringify(contact));
      });
  }

  get canSave () {
    return this.contact.firstName &&
      this.contact.lastName &&
      !this.api.isRequesting;
  }

  save () {
    this.api.saveContact(this.contact)
      .then(contact => {
        this.contact = contact;
        this.routeConfig.navModel.setTitle(contact.firstName);
        this.originalContact = JSON.parse(JSON.stringify(contact));
      });
  }

  canDeactivate () {
    if (!areEqual(this.originalContact, this.contact)) {
      return confirm('You have unsaved changes. Are you sure you wish to leave?');
    }

    return true;
  }
}
