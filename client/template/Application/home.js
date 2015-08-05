Template.home.helpers({
    book:function(){
        var text = Books.findOne().text.split(" ")
        returnArray = []
        for(var i = 0; i< text.length;i++){
            returnArray.push("<span class='word"+(i+1)+"'>"+text[i]+"</span>")
        }
        Session.set("limit",returnArray.length)
        return returnArray
    },
})

Template.home.events({
   'change .myFileInput': function(event, template) {
      FS.Utility.eachFile(event, function(file) {
        var doc = Temps.insert(file, function (err, fileObj) {
          if (err){
             // handle error
          } else {
             // handle success depending what you need to do
             fileObj.once('uploaded', function(){
                 console.log(this);
                 
                 var file = (Temps.files.findOne(this._id))
                 var stream = file.createReadStream('temps')
             })
          }
        });
     });
   },
})