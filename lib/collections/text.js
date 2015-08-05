/*Books = new Mongo.Collection('books');


Meteor.methods({
    insertFileObject:function(file){
        //Books.insert(epub.convertEpubFromBinary(Assets.getBinary("test.epub")))
        if(Meteor.isServer){
            Books.insert(epub.convertEpubFromBinary(Assets.getBinary(file)))
        }
    }
})

*/