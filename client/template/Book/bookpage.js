Template.bookpage.helpers({
    content:function(){
        console.log(this);
        parser = new DOMParser();
        console.log(parser.parseFromString(this.content[2].data,"text/xml"))
        return this.content[5].data
    }
})