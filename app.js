const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(__dirname + '/public'))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))

const fileUpload = require('express-fileupload'); // Use the express-fileupload middleware
var bodyParser = require('body-parser'); 
 
  
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(fileUpload());

var fs = require('fs');

var server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "localhost",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


  
app.post("/postdata", (req, res) => { 



    // { yo : data }
    console.log(req.body.yo);
    console.log(req.files);

    console.log(req.files.bumpmap)
    console.log(req.files.map)
    console.log(req.files.audio)


    // Move the uploaded image to our upload folder
    req.files.bumpmap.mv(__dirname + '/public/upload/bumpmap/' + req.files.bumpmap.name);
    req.files.map.mv(__dirname + '/public/upload/map/' + req.files.map.name);
    req.files.audio.mv(__dirname + '/public/upload/audio/' + req.files.audio.name);

    io.sockets.emit("createTrace", req.files.map.name);

 
    res.send("process complete"); 
}); 
 
app.get("/getdata", (req, res) => { 

    var myData = fs.readdirSync(__dirname+'/public/upload/map');
    myData = myData.map(function(x){return x.replace(/\.[^/.]+$/, "");});

    // TODO date fichier creation

    var data = { 
        traceData: myData
    } 
    console.log("to send", data)
    res.status(200).json(data) 
}); 
  


server.listen(3000, () => console.log('Visit http://127.0.0.1:3000'))



