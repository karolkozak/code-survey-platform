import * as React from "react";
import Prism from 'prismjs';
import './prism.css';
import './CodeListing.css';

export default class CodeListing extends React.Component {
  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    Prism.highlightAll();
  }

  render() {
    return (
        <div className="Code-Listing">
          <pre><code className="language-js">{this.props.code}</code></pre>
        </div>
    );
  }
}
