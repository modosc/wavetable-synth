import Cheby from './cheby'

// an shaper has
// 1) a waveshaper with a specific order cheby table loaded
// 2) two gains, one to control the amplitude of the sine input and the other
//    to control the output
//
// sine -> gain1 -> waveshaper -> gain2
//

// let ws = Cheby.buildWaveshaper({context: this.context, degree: i});
// let gain = this.context.createGain();
// //      let gain2 = this.context.createGain();
// //      gain2.gain.value = .4;
// gain.gain.value = 1;
// this.osc1.connect(gain);
// gain.connect(ws);
// ws.connect(g2);
// ws.connect(g);
// //      gain2.connect (this.scope.analyser);
// this.waveshapers[i] = { waveshaper: ws, gain: gain }
// }
module.exports = class {
  constructor(opts={}) {
    this.context = opts.context
    this.input = opts.input
    this.outputs = opts.outputs
    this.degree = opts.degree
    this.ws = Cheby.buildWaveshaper({context: this.context,
                                     degree: this.degree })
    this.inputGain = this.context.createGain()
    this.outputGain = this.context.createGain()
    this.input.connect(this.inputGain)
    this.inputGain.connect(this.ws)
    this.ws.connect(this.outputGain)
    this.outputs.map(o => this.outputGain.connect(o))
  }
}
