Template.booklistItem.events({
    "click #deleteBooklistItem":function(){
        console.log(this);
        Meteor.call("deleteBook",this)
    }
})