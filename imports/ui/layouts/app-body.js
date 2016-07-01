import { Meteor }       from 'meteor/meteor';
import { ReactiveVar }  from 'meteor/reactive-var';
import { Template }     from 'meteor/templating';
import { FlowRouter }   from 'meteor/kadira:flow-router';

import './app-body.jade';

const CONNECTION_ISSUE_TIMEOUT = 5000;


Template.App_body.onCreated(function appBodyOnCreated() {
});

Template.App_body.helpers({
});

Template.App_body.events({
});
