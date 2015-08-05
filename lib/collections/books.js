var Schemas = {};
Books = new Mongo.Collection('books');

Schemas.Book = new SimpleSchema({
    title:{
        type: String,
        label: "Title",
        },
    owner_id:{
        type:String,
        label: "userId"
        },
    cover:{
        type:String,
        label: "cover",
        optional: true
    },
    content:{
        type: [Object],
        optional:true
    },
    "content.$.name":{
        type: String,
        label: "Content Name"
    },
    "content.$.data":{
        type:String
    }
    
})

Books.attachSchema(Schemas.Book);


Meteor.methods({
    getEpubContent:function(file){
        //Books.insert(epub.convertEpubFromBinary(Assets.getBinary("test.epub")))
        if(Meteor.isServer){
            return epub.convertEpubFromBinary(Assets.getBinary(file))
        }
    }
})

if (Meteor.isClient){
    AutoForm.hooks({
      insertBookForm:{
          before: {
            insert: function (insertDoc) {
                insertDoc = _.extend(insertDoc,
                            {owner_id:Meteor.user()._id,
                            })
                return insertDoc
            }
          },
          after: {
              insert: function(err, result){
                Meteor.call("getEpubContent","test.epub",
                    function(err, content){
                        Books.update(result,{$set:{content:content}})
                });
                  Router.go('booklist');
              }
          }
      }
    });
}
