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
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}

//my code starts here
function mousePressed(){
  if (mouseX < imgIn.width && mouseY < imgIn.height) {
    loop();
  }
}
//ends here


function earlyBirdFilter(img){
  var resultImg = createImage(img.width, img.height);
      resultImg = sepiaFilter(img);
      resultImg = darkCorners(resultImg);
      resultImg = radialBlurFilter(resultImg);
     resultImg = borderFilter(resultImg)
  return resultImg;
}
// My code starts here

// Sepia filter function
// takes each pixel of the input image, calculates new color values based on a sepia tone formula, and stores the result in a new image
function sepiaFilter(img) {
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
    imgOut.pixels[i + 3] = img.pixels[i + 3]; 
  }

  imgOut.updatePixels();

  return imgOut;
}

// Ends here

// My code starts here

// Dark corners filter function
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

// Ends here

// My code starts here

// Radial blur filter function
function radialBlurFilter(img) {
  var resultImg = createImage(img.width, img.height);
  resultImg.loadPixels();
  img.loadPixels();
  let dynBlur = 0;

  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      // Calculate the distance between the current pixel and the mouse position
      var distance = dist(x, y, mouseX, mouseY);

      // Map the distance to a value between 0 and 1
      if (distance > 100 && distance <= 300) {
        dynBlur = constrain(map(distance, 100, 300, 0, 1), 0, 1);
      } else if (distance > 300) {
        dynBlur = 1;
      }

      // Perform convolution 
      var c = convolution(x, y, matrix, matrix.length, img);

      // Apply the dynamic blur to each color channel of the pixel
      var index = (x + y * img.width) * 4;
      resultImg.pixels[index + 0] = c[0] * dynBlur + img.pixels[index + 0] * (1 - dynBlur); // Red channel
      resultImg.pixels[index + 1] = c[1] * dynBlur + img.pixels[index + 1] * (1 - dynBlur); // Green channel
      resultImg.pixels[index + 2] = c[2] * dynBlur + img.pixels[index + 2] * (1 - dynBlur); // Blue channel
      resultImg.pixels[index + 3] = 255;
    }
  }

  resultImg.updatePixels();

  return resultImg;
}

// Ends here

// My code starts here

// Convolution function
function convolution(x, y, matrix, matrixSize, img) {
  var allReds = 0;
  var allGreens = 0;
  var allBlues = 0;

  var offset = floor(matrixSize / 2);

  for (var i = 0; i < matrixSize; i++) {
    for (var j = 0; j < matrixSize; j++) {
      var posX = x + i - offset;
      var posY = y + j - offset;

      var index = ((img.width * posY) + posX) * 4;

      index = constrain(index, 0, img.pixels.length - 1);

      allReds += img.pixels[index + 0] * matrix[i][j];
      allGreens += img.pixels[index + 1] * matrix[i][j];
      allBlues += img.pixels[index + 2] * matrix[i][j];
    }
  }

  return [allReds, allGreens, allBlues];
}

// Ends here

// My code starts here

// Border filter function
function borderFilter(img) {
  var buffer = createGraphics(img.width, img.height);
  buffer.image(img, 0, 0);
  buffer.noFill();
  buffer.strokeWeight(20);
  buffer.stroke(255);
  buffer.rect(0 + 10, 0 + 10, img.width - 20, img.height - 20, 40, 40, 40, 40);

  // Gets rid of the triangle in the corners
  buffer.strokeWeight(40);
  buffer.rect(0, 0, img.width, img.height);

  return buffer;
}

// Ends here
