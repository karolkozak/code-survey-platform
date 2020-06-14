import './HomePage.css';
import logo from "../../logo.png";
import {Link} from "react-router-dom";
import React from "react";
import Button from 'react-bootstrap/Button';

export default class HomePage extends React.Component {
  render() {
    return (
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>Code Survey Platform</h2>
          <div className="App-description">
            <p>
              Platform is carrying out a survey on people's attitudes code refactor.
              This platform is completely anonymous, but we would like to know something
              about your experience in programming before we start.
            </p>
            <p>
              Application contains two ways of code assessment - relative way and absolute one.
            </p>
            <p>
              In the relative way the survey provides you one example per page. On left and on right side you will see
              source code written in Java. Please take a look at both pieces of code and make a decision
              which code has better quality for you. You can press one of two buttons below the source codes.
            </p>
            <p>
              In the absolute one you will see only one column with code on the page and set of buttons below.
              With those buttons you can assess the quality of source code from 1 to 5, where 1 means code with poor
              quality and 5 means good quality.
            </p>
            <p>If you want to take part in survey, please click button below and fill the form.</p>
            <Button variant="info">
              <Link to="/form">Let's start!</Link>
            </Button>
          </div>
        </div>
    )
  }
}
