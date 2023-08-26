/**
 * Scanner component
 *
 * @author 
 */



import React, { Component } from 'react';
import Quagga from 'quagga';

class Scanner extends Component {
  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 380,
            height: 300,
            facingMode: 'environment',
          },
        },
        locator: {
            halfSample: true,
            patchSize: "large", 
            debug: {
                showCanvas: true,
                showPatches: false,
                showFoundPatches: false,
                showSkeleton: false,
                showLabels: false,
                showPatchLabels: false,
                showRemainingPatchLabels: false,
                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true
              }
            }
        },
        numOfWorkers: 4,
        decoder: {
            readers: ['code_128_reader'],
            debug: {
                drawBoundingBox: true,
                showFrequency: true,
                drawScanline: true,
                showPattern: true
            },
        },
        locate: true,
      },
      function(err) {
        if (err) {
          return console.log(err)
        }
        Quagga.start()
      },
    )
    Quagga.onDetected(this._onDetected)
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected)
  }

  _onDetected = result => {
    if (typeof this.props.onDetected === 'function') {
      this.props.onDetected(result);
    }
    Quagga.stop()
  }

  render() {
    return <div id="interactive" className="viewport"/>
    }
}

export default Scanner
