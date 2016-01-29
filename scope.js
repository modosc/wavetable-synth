import {window, document} from 'global';


//   constructor(opts={}) {
//     this.audioCtx = opts.context;
//     this.analyser = this.audioCtx.createAnalyser();
//     this.analyser.fftSize = 2048;
//
//     this.bufferLength = this.analyser.frequencyBinCount;
//     this.dataArray = new Uint8Array(this.bufferLength);
//     this.analyser.getByteTimeDomainData(this.dataArray);
//
//     this.canvas = document.getElementById("scope");
//     console.log(this.canvas);
//
//
//     this.canvasCtx = this.canvas.getContext("2d");
//
//   }
//   draw() {
//     console.log("this is");
//     console.log(this);
//     let drawVisual = requestAnimationFrame(this.draw);
//     this.analyser.getByteTimeDomainData(this.dataArray);
//     this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
//     this.canvasCtx.fillRect(0, 0, 200, 200);
//
//     this.canvasCtx.lineWidth = 2;
//     this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
//
//     this.canvasCtx.beginPath();
//
//     var sliceWidth = 200 * 1.0 / this.bufferLength;
//     var x = 0;
//
//     for(var i = 0; i < this.bufferLength; i++) {
//
//       var v = this.dataArray[i] / 128.0;
//       var y = v * 200/2;
//
//       if(i === 0) {
//         this.canvasCtx.moveTo(x, y);
//       } else {
//         this.canvasCtx.lineTo(x, y);
//       }
//
//       x += sliceWidth;
//     }
//     this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
//     this.canvasCtx.stroke();
//   }
// }
//module.exports = class {
//   constructor(opts={}) {
//     var WIDTH=200, HEIGHT=200;
// var audioCtx = opts.context;
// var analyser = audioCtx.createAnalyser();
//
//
// analyser.fftSize = 2048;
// var bufferLength = analyser.frequencyBinCount;
// var dataArray = new Uint8Array(bufferLength);
// analyser.getByteTimeDomainData(dataArray);
//
// var canvas = document.getElementById("scope");
// var canvasCtx = canvas.getContext("2d");
// canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
//
// // draw an oscilloscope of the current audio source
//  function draw() {
//       var drawVisual = requestAnimationFrame(draw);
//
//       analyser.getByteTimeDomainData(dataArray);
//
//       canvasCtx.fillStyle = 'rgb(200, 200, 200)';
//       canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
//
//       canvasCtx.lineWidth = 2;
//       canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
//
//       canvasCtx.beginPath();
//
//       var sliceWidth = WIDTH * 1.0 / bufferLength;
//       var x = 0;
//
//       for(var i = 0; i < bufferLength; i++) {
//
//         var v = dataArray[i] / 128.0;
//         var y = v * HEIGHT/2;
//
//         if(i === 0) {
//           canvasCtx.moveTo(x, y);
//         } else {
//           canvasCtx.lineTo(x, y);
//         }
//         x += sliceWidth;
//       }
//
//       canvasCtx.lineTo(canvas.width, canvas.height/2);
//       canvasCtx.stroke();
//     };
//
//     draw();
//   }
// }

module.exports = class {
  constructor(opts={}) {
    this.context =  opts.context;
    this.analyser = this.context.createAnalyser();
    console.log(this.analyser);
    this.analyser.fftSize = 2048;

	  this.width = opts.width;
	  this.height = opts.height;
    this.canvas = document.getElementById("scope");
    this.canvasCtx = this.canvas.getContext("2d");
  }

  draw() {
    var context = this.canvasCtx;
  	var data = new Uint8Array(this.analyser.frequencyBinCount);
  	var quarterHeight = this.height/4;
  	var scaling = this.height/256;

  	this.analyser.getByteTimeDomainData(data);
  	context.strokeStyle = "red";
  	context.lineWidth = 1;
  	context.fillStyle="#004737";
  	context.fillRect(0,0,this.width, this.height);
  	context.beginPath();
  	context.moveTo(0,0);
  	context.lineTo(this.width,0);
  	context.stroke();
  	context.moveTo(0,this.height);
  	context.lineTo(this.width,this.height);
  	context.stroke();
  	context.save();
  	context.strokeStyle = "#006644";
  	context.beginPath();
  	if (context.setLineDash)
  		context.setLineDash([5]);
  	context.moveTo(0,quarterHeight);
  	context.lineTo(this.width,quarterHeight);
  	context.stroke();
  	context.moveTo(0,quarterHeight*3);
  	context.lineTo(this.width,quarterHeight*3);
  	context.stroke();

  	context.restore();
  	context.beginPath();
  	context.strokeStyle = "blue";
  	context.moveTo(0,quarterHeight*2);
  	context.lineTo(this.width,quarterHeight*2);
  	context.stroke();

  	context.strokeStyle = "white";

  	context.beginPath();

  	var zeroCross = findFirstPositiveZeroCrossing(data, this.width);

  	context.moveTo(0,(256-data[zeroCross])*scaling);
  	for (var i=zeroCross, j=0; (j<this.width)&&(i<data.length); i++, j++)
  		context.lineTo(j,(256-data[i])*scaling);

  	context.stroke();

    requestAnimationFrame(this.draw.bind(this));
  }
}

var MINVAL = 134;  // 128 == zero.  MINVAL is the "minimum detected signal" level.

function findFirstPositiveZeroCrossing(buf, buflen) {
  var i = 0;
  var last_zero = -1;
  var t;

  // advance until we're zero or negative
  while (i<buflen && (buf[i] > 128 ) )
    i++;

  if (i>=buflen)
    return 0;

  // advance until we're above MINVAL, keeping track of last zero.
  while (i<buflen && ((t=buf[i]) < MINVAL )) {
    if (t >= 128) {
      if (last_zero == -1)
        last_zero = i;
    } else
      last_zero = -1;
    i++;
  }

  // we may have jumped over MINVAL in one sample.
  if (last_zero == -1)
    last_zero = i;

  if (i==buflen)  // We didn't find any positive zero crossings
    return 0;

  // The first sample might be a zero.  If so, return it.
  if (last_zero == 0)
    return 0;

  return last_zero;
}
