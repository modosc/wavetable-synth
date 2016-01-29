import Synth from './synth';
document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <style>
    input[type="range"]
    {
      -webkit-appearance: slider-vertical; /* WebKit */
    }
    label, outout {
      width: 100%;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container-fluid" style="margin: 30px">
    <form>
      <div class="row">
        <div class="col-md-6">
          <canvas id="scope" width="512" height="256" style="border:1px solid #000000;">
          </canvas>
        </div>
        <div class="col-md-6">
          <pre id="key_data" style="overflow: scroll; height: 256px"></pre>
        </div>
      </div>
      <div class="row">
        <div class="col-md-1">
          <div class="form-group">
            <label for="frequency-slider">Frequency</label>
            <output for="frequency-slider" id="frequency">440</output>
            <input type="range" id="frequency-slider" min="0.0" value="0.0" max="9.0" step="0.0000001" oninput="frequencyUpdate(value)">
          </div>
        </div>
      </div>

`)
let types = ['output', 'input']
types.forEach( (type) => {
  document.write(`
      <h2>${type} amplitudes</h2>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group" style="float: left; width: 5.88%">
            <label for="${type}-amplitudes">all</label>
            <input type="range" id="${type}-amplitudes-slider" min="-1.0" value="0.0" max="1.0" step="0.0001" oninput="${type}AmplitudeUpdate(-1, value)">
            <output for="slider" id="${type}-amplitudes"></output>
          </div>
`)
  for (var i=1; i<=Synth.DEGREE; i++) {
    document.write(`
          <div class="form-group" style="float: left; width: 5.88%">
            <label for="${type}-amplitude${i}">${i}</label>
            <input type="range" id="${type}-amplitude-slider${i}" min="-1.0" value="0.0" max="1.0" step="0.0001" oninput="${type}AmplitudeUpdate(${i}, value)">
            <output for="${type}-amplitude-slider${i}" id="${type}-amplitude${i}"></output>
          </div>
`);
  }
  document.write(`
      </div>`)
})
document.write(`
    </div>
  </div>
</body>
</html>`)

var synth = new Synth();
//console.log(synth);
window.synth = synth;
const minFreq = 27.5;
const maxFreq = 14080;

// 9 octaves, so slider goes from 0-9
// every increase of 1 doubles f

window.frequencyUpdate = function(val) {
  let freq = Math.pow(2, val) * minFreq;
  synth.osc1.frequency.setValueAtTime(freq, synth.context.currentTime)
  document.querySelector('#frequency').value = freq;
//  synth.osc2.frequency.value = Math.pow(2, val) * minFreq * 0.33  ;
}

window.outputAmplitudeUpdate = function(i, val) {
  if (i === -1) {
    document.querySelector(`#output-amplitudes`).value = val;
    for (let j=1; j<=Synth.DEGREE; j+=1) {
      document.querySelector(`#output-amplitude${j}`).value = 10 * Math.log10(Math.abs(val)).toFixed(2)
      document.querySelector(`#output-amplitude-slider${j}`).value = val;
      synth.waveshapers[j].outputGain.gain.value = val;
    }
  } else {
    document.querySelector(`#output-amplitude${i}`).value = 10 * Math.log10(Math.abs(val)).toFixed(2)
    synth.waveshapers[i].outputGain.gain.value = val;
  }
//  synth.waveshapers.forEach((ws) => ws.gain.gain.value = val);
//  console.log(synth.gain.value);
}

window.inputAmplitudeUpdate = function(i, val) {

//  a.y + (Math.log(_x) - Math.log(ax)) * (b.y - a.y) / (Math.log(bx) - Math.log(ax))

//  let glog = Math.pow(2, val) - 1;
//  let alog = Math.pow(2, val) - 1;
    //1 + (Math.log(val) - Math.log(1)) * 1 / (Math.log(0) - Math.log(1)
  // let freq = Math.pow(2, val) * minFreq;
//  let alog = val; //Math.log10(10 * val); // 1 - val; // Math.log10(10 * val);
//  let glog = val; // Math.log10(10 * (1 - val));
//  synth.amplitude = val;
  if (i === -1) {
    document.querySelector(`#input-amplitudes`).value = val;
    for (let j=1; j<=Synth.DEGREE; j+=1) {
      document.querySelector(`#input-amplitude${j}`).value = document.querySelector(`#input-amplitude-slider${j}`).value = val;
      synth.waveshapers[j].inputGain.gain.value = val;
    }
  } else {
    document.querySelector(`#input-amplitude${i}`).value = val;
    synth.waveshapers[i].inputGain.gain.value = val;
  }
//  synth.waveshapers.forEach((ws) => ws.gain.gain.value = val);
//  console.log(synth.gain.value);
}
