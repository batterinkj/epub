Meteor.publish('bookMeta',function(){
      var options= {fields:{title:1,cover:1}}
      return Books.find({owner_id:this.userId},options)
})

Meteor.publish('bookData',function(book_id){
      var options = {fields:{'content':{$slice:[0,12]}}}
      return Books.find({_id:book_id},options)
})
Meteor.publish('files',function(){
      return Files.find()
})