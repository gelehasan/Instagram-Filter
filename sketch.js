// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(img.width, img.height);
    resultImg = sepiaFilter(img);
   resultImg = darkCorners(resultImg);
  // resultImg = radialBlurFilter(resultImg);
  // resultImg = borderFilter(resultImg)
  return resultImg;
}


function sepiaFilter(img){
  var imgOut = createImage(img.width, img.height);
  imgOut.loadPixels();
  img.loadPixels();
  
  for (var i = 0; i < img.pixels.length; i += 4) {
    var oldRed = img.pixels[i];
    var oldGreen = img.pixels[i + 1];
    var oldBlue = img.pixels[i + 2];

    var newRed = (oldRed * 0.393) + (oldGreen * 0.769) + (oldBlue * 0.189);
    var newGreen = (oldRed * 0.349) + (oldGreen * 0.686) + (oldBlue * 0.168);
    var newBlue = (oldRed * 0.272) + (oldGreen * 0.534) + (oldBlue * 0.131);

    imgOut.pixels[i] = newRed;
    imgOut.pixels[i + 1] = newGreen;
    imgOut.pixels[i + 2] = newBlue;
    imgOut.pixels[i + 3] = img.pixels[i + 3]; // Preserve alpha channel
  }

  imgOut.updatePixels();
  
  return imgOut;
}


function darkCorners(img) {
  var resultImg = createImage(img.width, img.height);
  var dynLum = 1.0;

  resultImg.loadPixels();
  img.loadPixels();

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Calculate the distance of the current pixel from the center
      var distance = dist(x, y, img.width / 2, img.height / 2);
      var index = (x + y * img.width) * 4;
 

      if (distance > 300 && distance <= 450) {
      // Map the distance to a value between 1 and 0.4 (adjust the range as needed)
  
        dynLum = map(distance, 300, 450, 1.0, 0.4);

     
      } else if (distance > 450) {
   
        // Scale by a value between 0.4 and 0
        dynLum = map(distance, 450, img.width / 2, 0.4, 0.0);
       
      }
  
      dynLum = constrain(dynLum, 0.0, 1.0); // Constrain the value to the range [0.0, 1.0]

      // Apply the dynamic luminance to each color channel of the pixel
    
      resultImg.pixels[index] = img.pixels[index] * dynLum;
      resultImg.pixels[index + 1] = img.pixels[index + 1] * dynLum;
      resultImg.pixels[index + 2] = img.pixels[index + 2] * dynLum;
      resultImg.pixels[index + 3] = img.pixels[index + 3];


      
    }
  }

  resultImg.updatePixels();
  return resultImg;
}
