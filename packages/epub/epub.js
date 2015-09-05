// Write your package code here!
var zlib = Npm.require("zlib");
var epubBuffer;
var directory = [];
var content = []
/*****
 * Finds the End of Central Directory Record in the zip file which provides information
 * on the locations and number of central directory records
 * Because the eocdr is located at the end of the file we need to search backwards through
 * the file.  We can start slightly reversed from the end because we know the minimum size
 * of eocder
 *****/
var findEocdr = function(buffer){
    var eocdrSizeWithoutComment = 22;
    var bufferSearchStartIndex = buffer.length - 22;
    for(var i = bufferSearchStartIndex; i >0; i--){
        if(buffer.readUInt32LE(i)!==0x06054b50) continue
        else{
            var eocdr = {}
            var eocdrBuffer = buffer.slice(i);
            
            //0 - end of central dir signature    4 bytes  (0x06054b50)
            //4 - number of this disk             2 bytes
                if(eocdrBuffer.readUInt16LE(4)>0)console.log("error more than 1 disk!!!!!!!!")
            //6 - number disk with the start of the central directory  2 bytes
            //8 - total number of entries in the central directory on this disk  2 bytes
            //10 - total number of entries in the central directory           2 bytes
                eocdr.cdrEntries = eocdrBuffer.readUInt16LE(10)
            //12 - size of the central directory   4 bytes
                eocdr.size = eocdrBuffer.readUInt32LE(12)
            //16 - offset of the start of the central directory for the starting disk 4 bytes
                eocdr.cdrOffset = eocdrBuffer.readUInt32LE(16)
            //20 - .ZIP file comment length        2 bytes
            //22 - .ZIP file comment       (variable size)
            console.log(eocdr)
            return (eocdr);
        break
        }
    }
}

var readCentralDirectory = function(offset){
    if(epubBuffer.readUInt32LE(offset)!==0x02014b50){
        console.log("Error the offset does not reference the start of the central directory entry")
        return
    }
    var stored = {}
    //0 - Central file header
    //4 - version made by 
    //6 - version needed to extract
    //8 - general purpose bit glag
    //10 - compression method
        var compressionMethod = epubBuffer.readUInt16LE(offset+10)
        stored["compression"] = compressionMethod;
    //12 - last mod file time
    //14 - last mod file date
    //16 - crc-32
    //20 - compressed size
    //24 - uncompressed size
    //28 - file name length
        var fileNameLen = epubBuffer.readUInt16LE(offset+28)
    //30 - extra field length
        var extraFieldLen = epubBuffer.readUInt16LE(offset+30)
    //32 - file comment length
        var fileCommentLen = epubBuffer.readUInt16LE(offset+32)
    //34 - disk number start
    //36 - internal file attributes
    //38 - external file attributes
    //42 - relative offset of local header
        stored['offset'] = epubBuffer.readUInt32LE(offset+42)
    //46 - file name (varible length)
        stored["fileName"] = epubBuffer.toString('ascii',offset+46,offset + 46 +fileNameLen)
    //46 + file name length - extra field (variable length)
    //46 + file name length + extra field length - file comment (variable length)
    var totalEntryLength = 46+fileNameLen+extraFieldLen+fileCommentLen
    directory.push(stored);
    readCentralDirectory(offset+totalEntryLength)
}

var readEntry = function(entry){
      var file = {}
      var offset = entry.offset;
      //0 - local file header signature     4 bytes  (0x04034b50)
      //4 - version needed to extract       2 bytes
      //6 - general purpose bit flag        2 bytes
      //8 - compression method              2 bytes
        var compressionMethod = epubBuffer.readUInt16LE(offset+8);
      //10 - last mod file time              2 bytes
      //12 - last mod file date              2 bytes
      //14 - crc-32                          4 bytes
      //18 - compressed size                 4 bytes
        var compressedSize = epubBuffer.readUInt32LE(offset+18)
      //22 - uncompressed size               4 bytes
      //26 - file name length                2 bytes
        var fileNameLen = epubBuffer.readUInt16LE(offset+26)
      //28 - extra field length              2 bytes
        var extraFieldLen = epubBuffer.readUInt16LE(offset + 28)
      //30 - file name (variable size)
        var path = epubBuffer.toString('ascii',offset+30,offset+30+fileNameLen)
        if (path.slice(-1)==='/') return
        //file.name = _.last(path.split('/'))
        file.name = path
      //30 + file name length - extra field (variable size)
      //30 + file name length + extra field length - file data
        if( compressionMethod === 0){
            file.data = epubBuffer.toString('ascii',offset+30+fileNameLen+extraFieldLen,
                                                offset+30+fileNameLen+extraFieldLen+compressedSize)
        }else if(compressionMethod ===8){
            future = Npm.require('fibers/future');
            var fut = new future();
            var entryBuffer = epubBuffer.slice(offset+30+fileNameLen+extraFieldLen,
                                                offset+30+fileNameLen+extraFieldLen+compressedSize);
            Meteor.wrapAsync(zlib.inflateRaw(entryBuffer,function(err,result){
                                              fut.return(result);
                                          }))
            file.data = fut.wait().toString()
        }
        content.push(file)
}



epub = {
    convertEpubFromBinary: function(epubBinary){
       epubBuffer = new Buffer(epubBinary);
       var eocdr = findEocdr(epubBuffer);
       readCentralDirectory(eocdr.cdrOffset)
       for(var i = 0; i<directory.length; i++){
           readEntry(directory[i])
       }
       return content;
    }

}