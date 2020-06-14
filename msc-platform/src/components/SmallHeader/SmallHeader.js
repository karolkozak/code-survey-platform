import './SmallHeader.css';
import * as React from "react";
import logo from "../../logo.png";

export default class SmallHeader extends React.Component {
  render() {
    return (
        <div className="Small-header">
          <div className="App-logo-small-container"><img src={logo} className="App-logo-small" alt="logo"/></div>
          <h1 className="App-name">Code Survey Platform</h1>
        </div>
    )
  }
}
