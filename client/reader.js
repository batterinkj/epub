reader = function(){
    Session.set("counter",0);
    var myVar = setInterval(function () {myTimer()}, 100);
    function myTimer() {
        counter = Session.get("counter")
        $(".word"+counter).removeAttr('style')
        counter++;
        $(".word"+counter).css({color:"red"})
        if( counter>Session.get("limit")){
        	clearInterval(myVar)
        }
        Session.set("counter",counter)
    }
}

