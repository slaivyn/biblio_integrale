import { FlowRouter }        from 'meteor/kadira:flow-router';
import { BlazeLayout }       from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/app-body.js'

import '/imports/ui/pages/home.js'


FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("App_body", {main: "home"});
  }
});
