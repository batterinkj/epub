Template.bookNew2.events({
    'click #submitfile' : function(event,template){ 
        var file = $('#input').get(0).files[0]; //assuming 1 file only
        var filename = $('#filename').val()
        if (!file) return;
        if (!filename) return;
    
        var reader = new FileReader(); //create a reader according to HTML5 File API
    
        reader.onload = function(event){          
          var buffer = new Uint8Array(reader.result) // convert to binary
          //console.log(buffer);
          Meteor.call('saveFile', filename, buffer);
        }
    
        reader.readAsArrayBuffer(file); //read the file as arraybuffer
    }
    
})

