tempStore = new FS.Store.GridFS("temps");

Temps = new FS.Collection("temps", {
 stores: [tempStore]
});

Temps.allow({
 insert: function(){
 return true;
 },
 update: function(){
 return true;
 },
 remove: function(){
 return true;
 },
 download: function(){
 return true;
 }
});
