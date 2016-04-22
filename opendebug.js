/* ########################################################

        Open Energy Playground
        Energy Dashboard 2
        Marius Johansen
        Interactive Institute - Swedish ICT
        majo@tii.se
        
######################################################## */

//This is where you set which topic to subribe to
var mTopic = localStorage.getItem("mTopic");

//define some variables and array to store the data
dataObjectsArray = [];
objIndex = 0;
objNr = 0;

//Sound clips and etc..
var connectSnd = new Audio("sounds/Heartbeat.mp3"); 
var payloadSnd = new Audio("sounds/WoodTap.mp3");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function updateGrid(objIndex) {

    console.log('updated: ' + dataObjectsArray[objIndex].topic);
    $('#payload_' + objIndex).prepend( dataObjectsArray[objIndex].payload + '<br>' );  
    
    payloadSnd.play();
    
    $('#topic_'+ objIndex)
        .velocity( { opacity: 0.75, translateX: 50, scaleY: 1 },{ duration:200 })
        .velocity( { opacity: 1, translateX: 0, scaleY: 1 },{ duration:200 });
    
};



function addGrid(objIndex) {
      
    console.log('added: ' +  dataObjectsArray[objIndex].topic);
    connectSnd.play();
    
    $('#msgDiv').append(
        
            '<hr>'
            +'<div class="columnFlexWrapper" style="margin-bottom:20px;">'
                +'<div class="topicDiv" id="topic_' + objIndex + '">' + dataObjectsArray[objIndex].topic + '</div>'
                +'<div class="payloadDiv" id="payload_' + objIndex + '">' + dataObjectsArray[objIndex].payload + '</div>'
            +'</div> <!-- end of columnFlexWrapper -->'
                           
        );
    
    //var mytestData = jQuery.parseJSON(dataObjectsArray[objIndex]);

    
};



//Check and see if data object is a new object or already exist, then add or update
function inArrayCheck(objTopic, data) {
    
    var result = $.grep(dataObjectsArray, function(e){ return e.topic == objTopic; });
    
    if (result.length == 0) {
        
        //objId is not found in equipmentArray, add it
        dataObjectsArray.push(data);
        objIndex = dataObjectsArray.map(function(x) {return x.topic; }).indexOf(objTopic);
        addGrid(objIndex, data);
        
    } else if (result.length == 1) {
        
        //objId is found in equipmentArray, update data
        objIndex = dataObjectsArray.map(function(x) {return x.topic; }).indexOf(objTopic);
        dataObjectsArray[objIndex] = data;
        updateGrid(objIndex, data);        
    }  
}


// connect to op-en.se mqtt broker and subscribe to topic in input field
var socket = io.connect('http://wwww.op-en.se:5000');     
socket.on('connect', function () {
    socket.on('mqtt', function (msg) {

        if (msg.payload != 'Connected') {
                        
            var data = msg;
            var objTopic = data.topic;
            inArrayCheck(objTopic, data);
            //console.log(dataObjectsArray);

        }

    }); //end of mqtt msg function

    socket.emit('subscribe',{ topic: mTopic } );
        
}); //end of socket.io connect function
    




$( document ).ready(function() {
    
    
    $("#inputTopic").val(mTopic);
    
    //run this when input of mqtt topic changes
    $('#inputTopic').change('input', function() { 
                
        $('#debugDiv').html("");
        
        mTopic = $(this).val() // get the current value of the input field.
        localStorage.setItem("mTopic", mTopic);
        console.log(mTopic);
          
        //reload page with new mqtt topic
        location.reload();
        
    });
    
    
    //Bind functions to slidetoggle buttons
    $('.titleDiv').click( function () {
        
          var $elem = $(this);        
          $(this).next('div.contentDiv').slideToggle('fast', function() {
              if($(this).is(':visible')){
                  
                $elem.children('div.toggleVis').css( "background-image", 'url("images/toggleVisOff.png")' );
                  
              }else{ 
               
                $elem.children('div.toggleVis').css( "background-image", 'url("images/toggleVisOn.png")' );
                  
              } 
          }); 
    });
    
    

}); //End of document ready function


  