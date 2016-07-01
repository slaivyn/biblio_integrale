import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts }   from 'meteor/accounts-base'

//T9n.setLanguage("fr");

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
})
