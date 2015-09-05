Files = new Mongo.Collection('files');

Meteor.methods({
    'saveFile': function(filename, buffer){
        //Files.insert({filename: filename, data:buffer})         
        Meteor.call("getEpubContent",buffer,
                    function(err, content){
                            Books.insert({title:filename, owner_id:Meteor.userId(), dateAdded: new Date(), content:content},function(err){
                            console.log(err + "3")
                        })
                });
        Router.go('booklist');
    },
    'getEpubContent': function(buffer){
        if(Meteor.isServer){
            return epub.convertEpubFromBinary(buffer)
        }
    }
    
});