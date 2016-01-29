import {window} from 'global';
import Scope from './scope';
import Osc from './osc';
import Cheby from './cheby';
import MIDI from './midi'
import Envelope from './envelope'
import Shaper from './shaper'



module.exports = class {
  static get DEGREE() {
    return Cheby.DEGREE
  }
  constructor(opts={}) {

    this.context = new window.AudioContext();
    this.midi = new MIDI()
    this.midi.init();

    this.amplitude = 0.0;

    let that = this;
    this.gain = this.context.createGain();
    this.gain.value = 0;

//    this.osc = new Osc({context: this.context});

    this.osc1 = this.context.createOscillator();
    this.osc1.frequency.value = 440;
    this.osc1.type = 'sine';

//    this.osc1.connect(this.context.destination);

    this.scope = new Scope({context: this.context, width: 512, height: 256});

    let analyserGain = this.context.createGain();
//    this.osc1.connect(analyserGain);
    analyserGain.gain.value = .1;
    analyserGain.connect(this.scope.analyser);

    let outputGain = this.context.createGain();
    outputGain.connect(this.context.destination);

    let env = new Envelope({context: this.context, midi: this.midi, target: outputGain.gain})

    this.waveshapers = []
    for (let i=1; i<=Cheby.DEGREE; i+= 1) {
      this.waveshapers[i] = new Shaper({context: this.context,
                                        input: this.osc1,
                                        outputs: [analyserGain, outputGain],
                                        degree: i})
    }


    this.midi.on('noteOn', (msg) => {
      this.osc1.frequency.setValueAtTime(440 * Math.pow(2, (msg.note - 69) / 12), this.context.currentTime);
//      this.waveshapers.forEach(ws => ws.inputGain.gain.setValueAtTime(msg.velocity / 127.0, this.context.currentTime))
    })

    this.midi.on('pressure', (msg) => {
      this.waveshapers.forEach((ws, i) => { if (i % 2 == 1) ws.inputGain.gain.setValueAtTime(msg.velocity / 127.0 , this.context.currentTime) } )
    })
//    console.log(this.waveshapers)
    // this.waveshaper = Cheby.buildWaveshaper({context: this.context, degree: 3});
    // this.gain.connect(this.waveshaper);
    // this.waveshaper.connect(this.context.destination);
//    this.osc1.connect(this.processor);


    // this.osc2 = this.context.createOscillator();
    // this.osc2.frequency.value = 475;
    // this.osc1.type = 'sine';
    // this.osc2.connect(this.processor);

    //    this.processor.connect(this.context.destination);
//    this.gain.connect(this.processor);
//    this.processor.connect(this.context.destination);
//    this.scope = new Scope({context: this.context, width: 512, height: 256});
//    this.scope.draw();
//    this.processor.connect(this.scope.analyser);
//    this.gain.connect(this.scope.analyser);
//    requestAnimationFrame(this.scope.draw.bind(this.scope));
    this.scope.draw();
    this.osc1.start(0);
//    this.osc2.start(0);
  }
}
