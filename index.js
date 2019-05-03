const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
const jsQR = require("jsqr");
var fs = require('fs');
var multer = require("multer");
var Jimp = require('jimp');
var QrCode = require('qrcode-reader');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image'+ '.' + filetype);
    }
});
var upload = multer({storage: storage});


function convertPNGtoByteArray(pngData) {
  const data = new Uint8ClampedArray(pngData.width * pngData.height * 4);
  for (let y = 0; y < pngData.height; y++) {
    for (let x = 0; x < pngData.width; x++) {
      const pixelData = pngData.getPixel(x, y);

      data[(y * pngData.width + x) * 4 + 0] = pixelData[0];
      data[(y * pngData.width + x) * 4 + 1] = pixelData[1];
      data[(y * pngData.width + x) * 4 + 2] = pixelData[2];
      data[(y * pngData.width + x) * 4 + 3] = pixelData[3];
    }
  }
  return data;
}



  //   const pngReader = new png('file');
  //   console.log(pngReader);
  //   pngReader.parse(function(err, pngData) {
  //     if (err) throw err;
  //     const pixelArray = convertPNGtoByteArray(pngData);
  //     console.log(jsQR(pixelArray, pngData.width, pngData.height));
  //   });


  function fileread(filename){

    var contents= fs.readFileSync(filename);
    return contents;
}

  app.get('/', function(req, res){
    res.send('For now only accepting post calls');
  });


  app.post('/upload',upload.single('file'),function(req, res, next) {

    var buffer = fs.readFileSync(__dirname + '/public/images/image.png');
    console.log(buffer);
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
        var qr = new QrCode();
        qr.callback = function(err, value) {
            if (err) {
                console.error(err);
                // TODO handle error
            }
            if(value == undefined){
              res.send("No patterns or value found")
            }
            const response = value.result;
            res.send(response);
        };
        qr.decode(image.bitmap);
       
    });
  
  
  })


  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
  