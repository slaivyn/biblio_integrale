import { Meteor } from 'meteor/meteor';

//import '../common/useraccounts-configuration.js';
import '../common/admin-configuration.js';
//import './fixtures.js';
import './register-api.js';

if(Meteor.settings.MAIL_URL)
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
