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

Router.route("booklist",{
    name: "booklist"
})