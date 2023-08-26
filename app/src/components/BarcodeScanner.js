/**
 * Barcode Scanner Component
 *
 * Allows the user to scan the barcode and stores the result in the state.
 *
 * @author
 */

import React, { Component } from "react";
import Scanner from "./Scanner";

class BarcodeScanner extends Component {
  state = {
    results: [],
  };

  _scan = () => {
    this.setState({ scanning: !this.state.scanning });
  };

  _onDetected = (result) => {
    this.setState({ results: [] });
    this.setState({ results: this.state.results.concat([result]) });
    // Pass the scanned result to the parent component via the callback function
    this.props.onScan(result.codeResult.code);
  };

  render() {
    return (
      <div>
        <Scanner onDetected={this._onDetected} />
      </div>
    );
  }
}

export default BarcodeScanner;
