import  stream             from 'stream';

import { Meteor }          from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema }    from 'meteor/aldeed:simple-schema';
import { HTTP }            from 'meteor/http';

//import { marc4js } from 'meteor/marc4js';
import { marc } from 'meteor/slaivyn:marcjs';

import { Books } from './books.js';

//const WorldcatApiEndpoint = "http://www.worldcat.org/webservices/catalog/search/worldcat/opensearch";
const WorldcatApiEndpoint = "http://www.worldcat.org/webservices/catalog/content/isbn";
const wskey    = "Cuik8gz9o84HsmuhrnVpSWuHOKweH2BPTRmsU0CTO0yDGzQ6HfqBI8GM5xDr9WBQDzJ91ObNpbtaVqD4";

const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<record xmlns="http://www.loc.gov/MARC21/slim">
   <leader>00000cam a2200000Ia 4500</leader>
   <controlfield tag="001">32176155</controlfield>
   <controlfield tag="008">950321s1995    fr a          001 0 fre d</controlfield>
   <datafield ind1=" " ind2=" " tag="020">
     <subfield code="a">2213029865</subfield>
   </datafield>
   <datafield ind1=" " ind2=" " tag="020">
     <subfield code="a">9782213029863</subfield>
   </datafield>
   <datafield ind1=" " ind2=" " tag="020">
     <subfield code="a">2253140635</subfield>
   </datafield>
   <datafield ind1=" " ind2=" " tag="020">
     <subfield code="a">9782253140634</subfield>
   </datafield>
   <datafield ind1="1" ind2=" " tag="041">
     <subfield code="a">fre</subfield>
     <subfield code="h">eng</subfield>
   </datafield>
   <datafield ind1="1" ind2=" " tag="100">
     <subfield code="a">Mandela, Nelson,</subfield>
     <subfield code="d">1918-2013.</subfield>
   </datafield>
   <datafield ind1="1" ind2="0" tag="240">
     <subfield code="a">Long walk to freedom.</subfield>
     <subfield code="l">Français</subfield>
   </datafield>
   <datafield ind1="1" ind2="3" tag="245">
     <subfield code="a">Un long chemin vers la liberté :</subfield>
     <subfield code="b">autobiographie /</subfield>
     <subfield code="c">Nelson Mandela ; trad. de l'anglais (Afrique du Sud) par Jean Guiloineau.</subfield>
   </datafield>
   <datafield ind1=" " ind2=" " tag="260">
     <subfield code="a">Paris :</subfield>
     <subfield code="b">Fayard,</subfield>
     <subfield code="c">1995.</subfield>
   </datafield>
   <datafield ind1=" " ind2=" " tag="300">
     <subfield code="a">658 p. :</subfield>
     <subfield code="b">ill. ;</subfield>
     <subfield code="c">24 cm</subfield>
   </datafield>
   <datafield ind1=" " ind2=" " tag="500">
     <subfield code="a">Includes index.</subfield>
   </datafield>
   <datafield ind1="1" ind2="4" tag="600">
     <subfield code="a">Mandela, Nelson,</subfield>
     <subfield code="d">1918- ...</subfield>
     <subfield code="x">Biographies.</subfield>
   </datafield>
   <datafield ind1="1" ind2="6" tag="600">
     <subfield code="a">Mandela, Nelson,</subfield>
     <subfield code="d">1918-</subfield>
   </datafield>
   <datafield ind1=" " ind2="6" tag="650">
     <subfield code="a">Présidents</subfield>
     <subfield code="z">Afrique du Sud</subfield>
     <subfield code="v">Biographies.</subfield>
   </datafield>
   <datafield ind1=" " ind2="6" tag="651">
     <subfield code="a">Afrique du Sud</subfield>
     <subfield code="x">Politique et gouvernement</subfield>
     <subfield code="y">1948-1994.</subfield>
   </datafield>
   <datafield ind1=" " ind2="6" tag="651">
     <subfield code="a">Afrique du Sud</subfield>
     <subfield code="x">Politique et gouvernement</subfield>
     <subfield code="y">1994-1999.</subfield>
   </datafield>
   <datafield ind1="1" ind2="7" tag="600">
     <subfield code="a">Mandela, Nelson,</subfield>
     <subfield code="d">(1918- ...)</subfield>
     <subfield code="x">Biographie.</subfield>
     <subfield code="2">ram</subfield>
   </datafield>
   <datafield ind1="1" ind2="7" tag="600">
     <subfield code="a">Mandela, Nelson.</subfield>
     <subfield code="2">rero</subfield>
   </datafield>
   <datafield ind1=" " ind2="7" tag="650">
     <subfield code="a">BIOGRAPHY.</subfield>
     <subfield code="2">unbist</subfield>
   </datafield>
   <datafield ind1=" " ind2="7" tag="650">
     <subfield code="a">SOUTH AFRICA.</subfield>
     <subfield code="2">unbist</subfield>
   </datafield>
   <datafield ind1="4" ind2="2" tag="856">
     <subfield code="3">Notice et cote du catalogue de la Bibliothèque nationale de France</subfield>
     <subfield code="u">http://catalogue.bnf.fr/ark:/12148/cb35763870m</subfield>
   </datafield>
 </record>`;
 /*if(Meteor.isServer) {
   const fakeStream = new stream.Readable();
   fakeStream._read = function noop(){};
   const reader = new marc.MarcxmlReader(fakeStream);
   const record = reader.parse(xml);
   const data = {};
   console.log(typeof record.as('json'))
   const fields = JSON.parse(record.as('json')).fields;
   const interestingFields = {
     100: "Auteur",
     240: "Titre original",
     245: "Titre",
     260: "Éditeur",
     300: "Format",
   };
   console.log(fields)
   for(let i = 0 ; i < fields.length ; i++) {
     const field = fields[i];
     if(interestingFields[field[0]]) {
       const key = interestingFields[field[0]];
       data[key] = "";
       let j = 3;
       while(j <= field.length) {
         data[key] += " " + field[j];
         j += 2;
       }
       console.log(key, data[key])
     }
   }
}*/

export const getDataFromIsbn = new ValidatedMethod({
  name: 'books.getDataFromIsbn',
  validate: new SimpleSchema({
    isbn: { type: String },
  }).validator(),
  run({ isbn }) {
    //this.unblock();
    if(!isbn)
      return false;
    return new Promise((fulfill, reject) => {
      if(Meteor.isClient)
        return fulfill()
      const book = Books.findOne({
        isbn: isbn,
        owner: this.userId
      });
      if(book)
        return fulfill(book)
      const url = `${WorldcatApiEndpoint}/${isbn}`;
      console.log(url)
      HTTP.get(url,
        {params: {wskey: wskey}},
        (error, result) => {
          if(error) {
            console.error(error)
          } else {
            const fakeStream = new stream.Readable();
            fakeStream._read = function noop(){};
            const reader = new marc.MarcxmlReader(fakeStream);
            const record = reader.parse(result.content);
            const data = {};
            const fields = JSON.parse(record.as('json')).fields;
            const interestingFields = {
               100: "author",
               240: "originalTitle",
               245: "titleAuthor",
               260: "editor",
               264: "editor",
               300: "format",
               490: "editor",
               520: "summary"
            };
            console.log(fields)
            for(let i = 0 ; i < fields.length ; i++) {
              const field = fields[i];
              if(interestingFields[field[0]]) {
                const key = interestingFields[field[0]];
                data[key] = data[key] || "";
                let j = 3;
                while(j <= field.length) {
                   data[key] += " " + field[j];
                   j += 2;
                }
              }
            }
            const separated = data.titleAuthor.split(' / ')
            if(separated.length == 2) {
              data.title  = separated[0];
              data.author = separated[1];
              if(data.author[data.author.length-1] === '.')
                data.author = data.author.slice(0, -1);
            } else {
              data.title = data.titleAuthor;
            }
            data.isbn = isbn;
            data.owner = this.userId;
            console.log(data)
            const bookId = Books.upsert(
              { title: data.title,
                author: data.author,
                owner:  data.owner
              },
              {$set: data}
            );
            fulfill(data);
          }
        }
      );
    });
  }
});
