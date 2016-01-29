# wavetable-synth
this is an experiment in non-linear waveshaping synthesis written using the [web audio api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). 

it uses [chebyshev polynomials](https://en.wikipedia.org/wiki/Chebyshev_polynomials) to create 16 wavetables and drives those tables with a variable amplitude sine wave. when the amplitude of the sine wave is low the output is a sine; when the amplitude is +/-1.0 the output includes a harmonic of the input sinewave (the Nth order polynomial gives the Nth harmonic); when the amplitude is somewhere in-between lots of interesting harmonics are created (see [here](http://music.columbia.edu/cmc/MusicAndComputers/chapter4/04_06.php) for more about this technique).

it supports midi in chrome and probably crashes in any other browser. it's very much a work in progress. 

the oscilliscope was lifted from [here](http://webaudiodemos.appspot.com/oscilloscope/index.html) and i will remove it very soon when my version is working. 

the midi was adpated from a few different tutorials.


