import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import '../common/useraccounts-configuration.js';
//import '../common/admin-configuration.js';
import './routes.js';


TAPi18n.setLanguage("fr");

sAlert.config({
  effect:       '',
  position:     'top-right',
  timeout:      4000,
  html:         false,
  onRouteclose: true,
  stack:        true,
  offset:       0,
  beep:         false,
});
