// an oscillator has
// 1) a waveshaper with a specific order cheby table loaded
// 2) two gains, one to control the amplitude of the sine input and the other
//    to control the output
//
// sine -> gain1 -> waveshaper -> gain2
//

module.exports = class {
  constructor(opts={}) {
    this.context = opts.context;
    this.osc = opts.osc //this.context.createOscillator();
  }
}
