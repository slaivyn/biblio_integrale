import moment from 'moment';
import { _ }  from 'lodash';

import { Players }  from '/imports/api/players/players.js'
import { Halls }    from '/imports/api/halls/halls.js'
import { Fields }   from '/imports/api/fields/fields.js'
import { Matches }  from '/imports/api/matches/matches.js'
import { hallList } from '/initial_halls.js'

const specialKeys = ['hallId', 'creatorId', 'teams', 'hallIds']

let idsIndex  = {};

function recursivelyReplace(value, obj) {
  if(typeof value === 'object') {
    if(Array.isArray(value)) {
      for(let key in value) {
        value[key] = recursivelyReplace(value[key], obj)
      }
      return value
    } else {
      for(let key in value) {
        value[key] = recursivelyReplace(value[key], obj)
      }
      return value
    }
  } else {
    if(typeof value === 'string' && obj[value])
      return obj[value];
    return value;
  }
}

function replaceMissingIds(obj) {
  _.each(obj, (value, key, obj) => {
    if(specialKeys.indexOf(key) > -1 && typeof value !== 'undefined') {
      obj[key] = recursivelyReplace(value, idsIndex)
    }
  })
}

Meteor.startup(() => {
  /*Halls.remove({});
  Fields.remove({})
  Players.remove({});
  Matches.remove({})*/

  let data = {};
  /*
  data.halls = [
    {
      name: 'Bordeaux 5',
      pictures: ['photo-terrain', 'photo-interior', 'photo-restaurant'],
      address: {
        street: "3, rue des crampons",
        zipcode: 33000,
        city: 'Bordeaux',
      },
      price: 7,
      area: 1500,

    },
    {
      name: 'Gradignan Club',
      pictures: ['photo-terrain', 'photo-interior', 'photo-restaurant'],
      address: {
        street: "3, rue des crampons",
        zipcode: 33000,
        city: 'Gradignan',
      },
      price: 7.5,
      area: 750,
    },
    {
      name: 'Mérignac Futsal',
      pictures: ['photo-terrain', 'photo-interior', 'photo-restaurant'],
      area: 500,
      price: 5,
      address: {
        street: "jhlk",
        zipcode: 44587,
        city: 'Mérignac',
      }
    },
    {
      name: 'Bordeaux Soccer5',
      pictures: ['photo-terrain', 'photo-interior', 'photo-restaurant'],
      area: 2000,
      price: 6,
      address: {
        street: "zfezfg",
        zipcode: 46548,
        city: 'Bordeaux',
      }
    },
  ];*/

  data.halls = [];
  data.fields = [];
  hallList.map((hall) => {
    data.halls.push({
      name: hall.name,
      pictures: hall.pictures,
      address: hall.address,
      tel: hall.tel,
      email: hall.email,
      links: hall.links,
      openingHours: hall.openingHours,
      prices: hall.prices,
      description: hall.description
    })
    hall.fields.map((field) => {
      data.fields.push({
        hallId: hall.name,
        size: field.size,
        name: field.name,
        type: field.type || 'indoor'
      })
    })
  });
  /*
  data.fields = [
    {hallId: "Bordeaux 5", size: 5, name: "Bordeaux 5 - #1"},
    {hallId: "Bordeaux 5", size: 5, name: "Bordeaux 5 - #2"},
    {hallId: "Bordeaux 5", size: 4, name: "Bordeaux 5 - #3"},
    {hallId: "Bordeaux 5", size: 3, name: "Bordeaux 5 - #4"},
    {hallId: "Gradignan Club", size: 5, name: "Gradignan Club - #1"},
    {hallId: "Gradignan Club", size: 5, name: "Gradignan Club - #2"},
    {hallId: "Gradignan Club", size: 4, name: "Gradignan Club - #3"},
  ];
  */

  

  
  data.players = [
    {
      nickname: 'Bob',
      firstname: 'Robert',
      lastname: 'Marchant',
      picture: 'Jean_Pierre_Papin',
      birthday: "1990-02-23",
      city: "Bordeaux",
      level: 1,
      hallIds: [
        'Urban Soccer Pessac',
        'Bordeaux Soccer'
      ]
    },
    {
      nickname: 'John',
      picture: 'Marco_Simeone',
      birthday: "1982-08-16",
      level: 3,
      city: "Mérignac",
      hallIds: [
        'Bordeaux Soccer',
        'Futbol Futbol Bordeaux',
      ]
    },
    {
      nickname: 'Marco',
      picture: 'Marcel_Desailly',
      birthday: "1960-09-12",
      level:    2,
      city: "Bordeaux",
      hallIds: [
        'Urban Soccer Pessac',
      ]
    },
    {
      nickname: 'Bill',
      picture: 'Youri_Djorkaeff',
      birthday: "1973-01-01",
      level:    5,
      city: "Bordeaux",
      hallIds: [
      ]
    },
    {
      nickname: 'Henry',
      birthday: "1995-03-03",
      city: "Bordeaux",
      level: 2,
      hallIds: [
        'Urban Soccer Pessac'
      ]
    }
  ];

  let updateAll = function(items, collection, key) {
    items.forEach((item) => {
      replaceMissingIds(item)
      let query = {};
      if(typeof key === 'string') {
        query[key] = item[key];
      } else {
        //query = recursivelyReplace(key, item)
        query.name = item.name;
        query.hallId = item.hallId;
      }
      let dbItem = collection.findOne(query);
      if(dbItem) {
        idsIndex[item[key]] = dbItem._id;
        if(Meteor.settings.public.env == 'dev') {
          //collection.remove(dbItem._id);
          collection.update(dbItem._id, {
            $set: item
          })
          console.log('updated ' + (query[key] || item.name))
        }
      }
      else {
        console.log("insert", query)
        idsIndex[item[key]] = collection.insert(item)
      }
    });
  }

  updateAll(data.halls,   Halls,   'name')
  updateAll(data.fields,  Fields,  {name: 'name', hallId: 'hallId'})
  
  if(Meteor.settings.public.env == 'dev') {
    updateAll(data.players, Players, 'nickname')
    Matches.remove({})
    const hall1 = Halls.findOne({name: 'Urban Soccer Pessac'});
    const hall2 = Halls.findOne({name: 'Bordeaux Soccer'});
    data.matches = [
      {
        fieldId: Fields.findOne({hallId: hall1._id})._id,
        startTime: moment().startOf("hour").add(1, "days").hour(12).toDate(),
        teams: [["Bob", "Marco"], []],
        level: 2,
        creatorId: "Marco",
      },
      {
        fieldId: Fields.findOne({hallId: hall2._id})._id,
        startTime: moment().startOf("hour").add(2, "days").hour(10).toDate(),
        teams: [["Bill"], ["John", "Henry"]],
        level: 3,
        creatorId: "Bill",
      },

    ]
    updateAll(data.matches, Matches, 'startTime')
  }
})