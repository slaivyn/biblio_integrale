import { Template }    from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert }      from 'meteor/juliancwirko:s-alert';

import { getDataFromIsbn } from '/imports/api/books/methods.js';

import './home.jade'

Template.home.onCreated(function() {
  this.scanned  = new ReactiveVar();
  this.error    = new ReactiveVar();
  this.bookData = new ReactiveVar();
})

Template.home.onRendered(function() {
  const template = this;
  sAlert.info("ready")
})

Template.home.helpers({
  scanned() {
    return Template.instance().scanned.get()
  },
  error() {
    return Template.instance().error.get()
  },
  isWeb() {
    return !Meteor.isCordova;
  },
  bookData() {
    return Template.instance().bookData.get()
  }
})

Template.home.events({

  'click .scan'(event, template) {
    printResult = function(err, result) {
      console.error(err)
      if(err)
        sAlert.error(result.text)
      else {
        template.bookData.set(result);
        console.log(result)
        sAlert.info("sauvegardé")
      }
    }
    if(Meteor.isCordova) {
      cordova.plugins.barcodeScanner.scan(
        function(result) {
          template.scanned.set(result);
          sAlert.info(result.text)
          getDataFromIsbn.call({isbn: result.text}, printResult);
        },
        function(error) {
          template.error.set(error);
        }
      )
    } else {
      getDataFromIsbn.call({isbn: "9782253140634"}, printResult);
    }
  }

})
