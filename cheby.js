// from http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
// via https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode

// function makeDistortionCurve( amount ) {
//   var k = typeof amount === 'number' ? amount : 50,
//     n_samples = 44100,
//     curve = new Float32Array(n_samples),
//     deg = Math.PI / 180,
//     i = 0,
//     x;
//   for ( ; i < n_samples; ++i ) {
//     x = i * 2 / n_samples - 1;
//     curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
//   }
//   return curve;
// };

const N_SAMPLES = 44100;

const DEGREE = 16

function cheby(k, x) {
  if (k === 0) return 1.0;
  if (k === 1) return x;
  return 2.0 * x * cheby( (k-1), x) - cheby((k-2), x);
}

// TODO - work out caching here, we're computing the same values over and over
// again. if we start at (say) K=5 then we'll have to compute 4,3,2,1,0 so if we
// are clever we only ever compute each K once. right now we're doing more than
// we need to. s
const curves = []
// const curves = new Float32Array(require("json!./wavetables.json"))

function buildChebyCurves(k) {
  for (let i = 1; i <=k ; i++) {
    console.log(`building curve for degree=${i}`);
    curves[i] = new Float32Array(N_SAMPLES);

    for (let j=0; j<N_SAMPLES; ++j) {
      let x = j * 2 / N_SAMPLES - 1;
      curves[i][j] = cheby(i, x);
    }
  }
}

buildChebyCurves(DEGREE);

console.log(curves);

function writeChebyCurves() {
  fs.appendFileSync('wavetables.json', JSON.stringify(curves), 'utf8');
}

module.exports = {
  buildWaveshaper: function(opts={}) {
    let context = opts.context;
    let waveshaper = context.createWaveShaper();
    waveshaper.curve = curves[opts.degree];
    waveshaper.oversample = '4x';
    return waveshaper;
  },
  DEGREE: DEGREE
}


// function writeChebyCurves(k) {
//   fs.appendFileSync('wavetables.json', JSON.stringify(buildChebyCurves(k)), 'utf8');
// }
// TODO reimplement with http://stackoverflow.com/questions/20306750/what-is-a-compact-way-to-save-a-float32array-to-disk-on-node-js
// TODO - don't do this, it's slow as shit

// for posterity, the old way i was doing cheby stuff:
//
// var chebyFns = []
// for (let i=0; i<16; i++) {
//   if (i == 0) {
//     chebyFns[i] = function(x, cache) {
//       cache[i] = 1.0;
//       return 1.0;
//     };
//   } else if (i == 1) {
//     chebyFns[i] = function(x, cache) {
//       cache[i] = x;
//       return x;
//     };
//   } else {
//     chebyFns[i] = function(x, cache) {
//       if (typeof(cache[i]) === "undefined") {
//         cache[i] = 2.0 * x * chebyFns[i-1](x, cache) - chebyFns[i-2](x, cache);
//       }
//       return cache[i];
//     };
//   }
// }
//
// //console.log(chebyFns);
// const cheby = function(k, x, cache) {
//   // if (k === 0) return 1.0;
//   // if (k === 1) return x;
//   // return 2.0 * x * cheby( (k-1), x) - cheby((k-2), x);
//   return chebyFns[k](x, cache);
// }
//const bufferSize = 128;
//
//    this.processor = this.context.createScriptProcessor(bufferSize, 1, 1)
// this.processor.onaudioprocess = function(e) {
//   // The input buffer is the song we loaded earlier
//   let inputBuffer = e.inputBuffer;
//
//   // The output buffer contains the samples that will be modified and played
//   let outputBuffer = e.outputBuffer;
//
//   for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
//       var inputData = inputBuffer.getChannelData(channel);
//       var outputData = outputBuffer.getChannelData(channel);
//
//       // Loop through the 4096 samples
//       for (var sample = 0; sample < inputBuffer.length; sample++) {
//         let scaled = inputData[sample] * that.amplitude;
//         let cache = [];
//         outputData[sample] =  inputData[sample] + cheby(13, scaled, cache)+ cheby(11, scaled, cache)+ cheby(9, scaled, cache) +  cheby(7, scaled, cache) + cheby(5, scaled, cache) + cheby(3, scaled, cache) + cheby(1, scaled, cache) //+ cheby(9, scaled) +  cheby(11, scaled) + cheby(13, scaled) + cheby(15, scaled); //+ (1 - that.amplitude);
//       }
//     }
// };
//
