const express = require("express")
const fs = require("fs")
const ffmpeg = require('ffmpeg');
const cors = require("cors");
require("dotenv").config()

const port = process.env.PORT || 8080
const app = express()
const expressWs = require("express-ws")(app)

app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/heartbeat', (req, res) => {
  res.status(200).json(1)
})

app.post('/test', (req, res) => {
  setTimeout(function() {
    res.status(200).json({
      "left":"rtertret",
      "right":"rerwetw",
      "ls":'success',
      "rs":'success',
      "id":0,
      "number":"X4545345"
    })
  }, 6000);
})

app.post('/test/eye', (req, res) => {
  setTimeout(function() {
    res.status(200).json({
      "left":"rtertret",
      "right":"rerwetw",
      "ls":'success',
      "rs":'success',
      "id":0,
      "number":"X4545345"
    })
  }, 6000);
})

app.post('/test/face', (req, res) => {
  setTimeout(function() {
    res.status(200).json({
      "face":"rtertret",
      "fs":'success',
      "id":0,
      "number":"X4545345"
    })
  }, 6000);
})

function toBase64(filePath) {
  const img = fs.readFileSync(filePath, "base64");
  return img.toString('base64');
}

function convertVideoToBase64(videoPath) {
  return new Promise((resolve, reject) => {
    try {
      var process = new ffmpeg(videoPath);
      process.then(function (video) {

          video.fnExtractFrameToJPG(__dirname + '/public', {
              frame_rate : 1,
              number : 1,
              file_name : 'my_frame_%s'
          }, function (error, files) {
              if (!error){
                  const base64String = toBase64(files.toString().split(",")[3]);

                  const withPrefix = 'data:image/jpeg;base64,' + base64String;

                  resolve(withPrefix)
              }
              else
                  reject(error)
          });

      }, function (err) {
          reject(err)
      });
  } catch (e) {
      console.log(e.code);
      console.log(e.msg);
  }
  });
}

app.get('/stream', (req, res) => {
  const videoPath = __dirname + '\\1.mp4';

  convertVideoToBase64(videoPath)
    .then((base64String) => {
      res.status(200).json({
        face: base64String
      })
    })
    .catch((error) => {
      // Handle the error
    });
})

app.listen(port, () => {
  console.log(`App is running at port: ${port}`);
})