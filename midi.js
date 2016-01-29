import {navigator, document} from 'global'
import {EventEmitter} from 'events'
let instance
//const keyData = document.getElementById('key_data')

class MIDI extends EventEmitter {
  constructor(opts={}) {
    // // singleton
    // if (!instance) {
    //   super()
    //   instance = this
    // }
    //
    // return instance
    super()
  }
  async init() {
    // init midi
    if (!navigator.requestMIDIAccess) {
      return Promise.reject("No MIDI support in your browser.")
    }
    await navigator.requestMIDIAccess({sysex: false})
        .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))
  }

  onMIDISuccess(midiAccess) {
    let midi = midiAccess;
    let inputs = midi.inputs.values();
    // loop through all inputs
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
      // listen for midi messages
      input.value.onmidimessage = this.onMIDIMessage.bind(this)
      // this just lists our inputs in the console
      this.listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = this.onStateChange.bind(this)
  }

   onMIDIMessage(event) {
     let data = event.data,
        cmd = data[0] >> 4,
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2];

      // with pressure and tilt off
      // note off: 128, cmd: 8
      // note on: 144, cmd: 9
      // pressure / tilt on
      // pressure: 176, cmd 11:
      // bend: 224, cmd: 14

      switch (type) {
        case 144: // noteOn message
          this.emit('noteOn', {note, velocity})
          break;
        case 128: // noteOff message
          this.emit('noteOff', {note, velocity})
          break;
        case 176:
          this.emit('pressure', {note, velocity})
          break;
      }

      //console.log('data', data, 'cmd', cmd, 'channel', channel);
      this.logger(document.getElementById('key_data'), 'key data', data);
  }

  listInputs(inputs) {
    let input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
          "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
          "' version: '" + input.version + "']");
  }

  logger(container, label, data) {
    let messages = label + " [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]";
    container.textContent = messages + "\n" + String(container.textContent)
  }

  onMIDIFailure(e) {
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
  }

  onStateChange(event) {
    let port = event.port,
      state = port.state,
      name = port.name,
      type = port.type;
    if (type === "input") console.log("name", name, "port", port, "state", state);
  }
}

module.exports = MIDI

// midi functions





//
// function noteOn(midiNote, velocity) {
//     player(midiNote, velocity);
// }
//
// function noteOff(midiNote, velocity) {
//     player(midiNote, velocity);
// }
//
// function player(note, velocity) {
//     var sample = sampleMap['key' + note];
//     if (sample) {
//         if (type == (0x80 & 0xf0) || velocity == 0) { //QuNexus always returns 144
//             btn[sample - 1].classList.remove('active');
//             return;
//         }
//         btn[sample - 1].classList.add('active');
//         btn[sample - 1].play(velocity);
//     }
// }



// audio functions
// We'll go over these in detail in future posts
// function loadAudio(object, url) {
//     var request = new XMLHttpRequest();
//     request.open('GET', url, true);
//     request.responseType = 'arraybuffer';
//     request.onload = function () {
//         context.decodeAudioData(request.response, function (buffer) {
//             object.buffer = buffer;
//         });
//     }
//     request.send();
// }
//
// function addAudioProperties(object) {
//     object.name = object.id;
//     object.source = object.dataset.sound;
//     loadAudio(object, object.source);
//     object.play = function (volume) {
//         var s = context.createBufferSource();
//         var g = context.createGain();
//         var v;
//         s.buffer = object.buffer;
//         s.playbackRate.value = randomRange(0.5, 2);
//         if (volume) {
//             v = rangeMap(volume, 1, 127, 0.2, 2);
//             s.connect(g);
//             g.gain.value = v * v;
//             g.connect(context.destination);
//         } else {
//             s.connect(context.destination);
//         }
//
//         s.start();
//         object.s = s;
//     }
// }

// utility functions
// function randomRange(min, max) {
//     return Math.random() * (max + min) + min;
// }
//
// function rangeMap(x, a1, a2, b1, b2) {
//     return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1;
// }
//
// function frequencyFromNoteNumber(note) {
//     return 440 * Math.pow(2, (note - 69) / 12);
// }

//var log = console.log.bind(console),
//     keyData = document.getElementById('key_data'),
//     midi;
// var AudioContext = AudioContext || webkitAudioContext; // for ios/safari
// var context = new AudioContext();
// var btnBox = document.getElementById('content'),
//     btn = document.getElementsByClassName('button');
// var data, cmd, channel, type, note, velocity;
//
// // request MIDI access
// if (navigator.requestMIDIAccess) {
//     navigator.requestMIDIAccess({
//         sysex: false
//     }).then(onMIDISuccess, onMIDIFailure);
// } else {
//     alert("No MIDI support in your browser.");
// }
//
// // add event listeners
// document.addEventListener('keydown', keyController);
// document.addEventListener('keyup', keyController);
// for (var i = 0; i < btn.length; i++) {
//     btn[i].addEventListener('mousedown', clickPlayOn);
//     btn[i].addEventListener('mouseup', clickPlayOff);
// }
// // prepare audio files
// for (var i = 0; i < btn.length; i++) {
//     addAudioProperties(btn[i]);
// }
// // this maps the MIDI key value (60 - 64) to our samples
// var sampleMap = {
//     key60: 1,
//     key61: 2,
//     key62: 3,
//     key63: 4,
//     key64: 5
// };
// // // user interaction, mouse click
// function clickPlayOn(e) {
//     e.target.classList.add('active');
//     e.target.play();
// }
//
// function clickPlayOff(e) {
//     e.target.classList.remove('active');
// }
// // qwerty keyboard controls. [q,w,e,r,t]
// function keyController(e) {
//     if (e.type == "keydown") {
//         switch (e.keyCode) {
//             case 81:
//                 btn[0].classList.add('active');
//                 btn[0].play();
//                 break;
//             case 87:
//                 btn[1].classList.add('active');
//                 btn[1].play();
//                 break;
//             case 69:
//                 btn[2].classList.add('active');
//                 btn[2].play();
//                 break;
//             case 82:
//                 btn[3].classList.add('active');
//                 btn[3].play();
//                 break;
//             case 84:
//                 btn[4].classList.add('active');
//                 btn[4].play();
//                 break;
//             default:
//                 //console.log(e);
//         }
//     } else if (e.type == "keyup") {
//         switch (e.keyCode) {
//             case 81:
//                 btn[0].classList.remove('active');
//                 break;
//             case 87:
//                 btn[1].classList.remove('active');
//                 break;
//             case 69:
//                 btn[2].classList.remove('active');
//                 break;
//             case 82:
//                 btn[3].classList.remove('active');
//                 break;
//             case 84:
//                 btn[4].classList.remove('active');
//                 break;
//             default:
//                 //console.log(e.keyCode);
//         }
//     }
// }
//
//
