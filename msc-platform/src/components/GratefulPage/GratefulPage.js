import * as React from "react";
import './GratefulPage.css';
import {Redirect} from "react-router-dom";

export default class GratefulPage extends React.Component {
  constructor(props) {
    super(props);
    this.emptyUserData = !window.localStorage.getItem('userData');
  }

  render() {
    if (this.emptyUserData) {
      return (<Redirect to="/" push={true}/>);
    }
    return (
        <div className="Grateful-Page">
          <div className="Grateful-Container">
            Thanks for your responses!
          </div>
        </div>
    );
  }
}
