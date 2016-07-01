import { Mongo }        from 'meteor/mongo';
import { Meteor }       from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Books = new Mongo.Collection('books');

Books.schema = new SimpleSchema({
  isbn:          { type: String },
  author:        { type: String, optional: true },
  title:         { type: String },
  originalTitle: { type: String, optional: true },
  editor:        { type: String },
  format:        { type: String },
  summary:       { type: String, optional: true },
  owner:         { type: String, optional: true },
  place:         { type: String, optional: true},
});

Books.attachSchema(Books.schema);
