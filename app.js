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
  
app.post("/postdata", (req, res) => { 



    // { yo : data }
    console.log(req.body.yo);
    console.log(req.files);

    console.log(req.files.bumpmap)
    console.log(req.files.map)
    console.log(req.files.audio)

    /*
    const { files } = req.files;

    // If no image submitted, exit
    if (!files) return res.sendStatus(400);

    */

    // Move the uploaded image to our upload folder
    req.files.bumpmap.mv(__dirname + '/upload/' + req.files.bumpmap.name);
    req.files.map.mv(__dirname + '/upload/' + req.files.map.name);
    req.files.audio.mv(__dirname + '/upload/' + req.files.audio.name);

 
    res.send("process complete"); 
}); 
 
app.get("/getdata", (req, res) => { 
    var data = { // this is the data you're sending back during the GET request 
        data1: "mee", 
        data2: "po" 
    } 
    res.status(200).json(data) 
}); 
  


app.listen(3000, () => console.log('Visit http://127.0.0.1:3000'))
