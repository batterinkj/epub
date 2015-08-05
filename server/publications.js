Meteor.publish('bookMeta',function(){
      var options= {fields:{title:1,cover:1}}
      return Books.find({owner_id:this.userId},options)
})