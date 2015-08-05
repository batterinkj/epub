Template.booklist.helpers({
    books: function(){
        return Books.find().fetch()
    }
})