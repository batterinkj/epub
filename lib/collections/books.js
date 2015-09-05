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
    dateAdded:{
        type: Date,
    },
    dateLastRead:{
        type: Date,
        optional:true,
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
    getEpubContent2:function(file){
        //Books.insert(epub.convertEpubFromBinary(Assets.getBinary("test.epub")))
        if(Meteor.isServer){
            return epub.convertEpubFromBinary(Assets.getBinary(file))
        }
    },
    deleteBook:function(book){
        Books.remove(book);
    }
})

if (Meteor.isClient){
    AutoForm.hooks({
      insertBookForm:{
          before: {
            insert: function (insertDoc) {
                insertDoc = _.extend(insertDoc,
                            {owner_id:Meteor.user()._id,
                             dateAdded: new Date()
                            })
                return insertDoc
            }
          },
          after: {
              insert: function(err, result){
                console.log(err+"err")
                Meteor.call("getEpubContent","test.epub",
                    function(err, content){
                        console.log(err)
                        console.log(content)
                        Books.update(result,{$set:{content:content}},function(err){
                            console.log(err + "3")
                        })
                });
                  Router.go('booklist');
              }
          }
      }
    });
}
