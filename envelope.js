import {EventEmitter} from 'events'

class Envelope extends EventEmitter {
  constructor(opts={}) {
    super()
    this.context = opts.context
    this.midi = opts.midi
    this.target = opts.target
    this.attack = opts.attack || 0.005
    this.decay = opts.decay || 0.5
    this.sustain = opts.sustain || 0.5
    this.release = opts.release || 1.0
    this.attackLevel = opts.attackLevel || 1.0
    this.decayLevel = opts.decayLevel || 0.6
    this.midi.on('noteOn', this.noteOn.bind(this))
    this.midi.on('noteOff', this.noteOff.bind(this))
    this.reset();
  }
  reset() {
    if (!this.target) return false
    this.target.cancelScheduledValues(this.context.currentTime)
    this.target.setValueAtTime(0, this.context.currentTime)
  }

  get target() {
    return this._target
  }
  set target(target) {
    this.reset()
    this._target = target
    return this._target
  }
  //
  // get attack() {
  //   console.log(`this._attack is ${this._attack}`)
  //   console.log(`attack is ${this.context.currentTime + this._attack}`)
  //   return (this.currentTime + this._attack)
  // }
  // get decay() {
  //   console.log(`this._decay is ${this._decay}`)
  //   console.log(`decay is ${this.context.currentTime + this._decay}`)
  //   return (this.currentTime + this._attack + this._decay)
  // }
  noteOn() {
    let cur = this.context.currentTime
    console.log('noteOn')
    console.log(`this.context.currentTime: ${cur}`)
    this.reset()
    this.target.linearRampToValueAtTime(this.attackLevel, cur + this.attack)
    console.log(this.target)
    // this.target
    //   .on('statechange',(e) => console.log('state change', e))
    //   .on('complete',(e) => console.log('complete', e))
    //   .on('ended',(e) => console.log('ended', e))
    this.target.linearRampToValueAtTime(this.decayLevel, cur + this.attack + this.decay)
    // TODO - how do we implement sustain? how can i callback here to check if
    // we're still in noteon?
  }
  noteOff() {
    console.log('noteOff')
    console.log(`this.context.currentTime: ${this.context.currentTime}`)
    this.target.linearRampToValueAtTime(0, this.context.currentTime + this.release)
  }
}

module.exports = Envelope
