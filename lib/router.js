var defaultWaitOn = function () {
        return [Meteor.subscribe('bookMeta')];
    }

Router.configure({
    layoutTemplate: 'layout'
})

Router.route("/",function(){
    if(Meteor.user()){
        this.render('booklist')
    }else{
        this.render('home')
    }

},{
    name: "home"
})

Router.route("bookNew",{
    name: "bookNew"
})
Router.route("bookNew2",{
    name: "bookNew2"
})

Router.route("booklist",{
    name: "booklist"
})

Router.route('/book/:_id', {
    name: 'bookpage',
    data: function(){
        var book = Books.findOne(this.params._id);
        if(!book) this.redirect("/")
        else return book ;},
    waitOn: function() {
        return Meteor.subscribe('bookData', this.params._id);
  },
})