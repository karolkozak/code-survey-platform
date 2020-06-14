import './StarterForm.css';
import * as React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router-dom";

export default class StarterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: 'less than 1 year',
      javaExperience: 'less than 1 year',
      designPatterns: '1',
      framework: 'No idea',
      refactoring: 'No idea',
      submit: false,
      surveyPath: ''
    };
  }

  handleExperience = event => {
    this.setState({experience: event.target.value});
  };

  handleJavaExperience = event => {
    this.setState({javaExperience: event.target.value});
  };

  handleDesignPatterns = event => {
    this.setState({designPatterns: event.target.value});
  };

  handleFramework = event => {
    this.setState({framework: event.target.value});
  };

  handleRefactoring = event => {
    this.setState({refactoring: event.target.value});
  };

  handleSubmit = (path) => {
    const formData = JSON.stringify(
        {
          experience: this.state.experience,
          javaExperience: this.state.javaExperience,
          designPatterns: this.state.designPatterns,
          framework: this.state.framework,
          refactoring: this.state.refactoring
        }
    );
    window.localStorage.setItem('userData', formData);
    this.setState({surveyPath: path});
    this.setState({submit: true});
  };

  render() {
    if (this.state.submit) {
      return this.state.surveyPath === 'survey'
          ? (<Redirect to="/survey" push={true}/>)
          : (<Redirect to="/absolute-survey" push={true}/>);
    }
    return (
        <div className="Page-container">
          <div className="Form-container">
            <Form>
              <Form.Group controlId="experience">
                <Form.Label>Choose your experience as programmer</Form.Label>
                <Form.Control as="select" value={this.state.experience} onChange={this.handleExperience}>
                  <option>less than 1 year</option>
                  <option>1 year</option>
                  <option>2-3 years</option>
                  <option>4-5 years</option>
                  <option>more than 5 years</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="java-experience">
                <Form.Label>Choose your experience in Java</Form.Label>
                <Form.Control as="select" value={this.state.javaExperience} onChange={this.handleJavaExperience}>
                  <option>less than 1 year</option>
                  <option>1 year</option>
                  <option>2-3 years</option>
                  <option>4-5 years</option>
                  <option>more than 5 years</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="design-patterns">
                <Form.Label>How do you rate your design patterns knowledge</Form.Label>
                <Form.Control as="select" value={this.state.designPatterns} onChange={this.handleDesignPatterns}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="framework">
                <Form.Label>What the <i>framework</i> is?</Form.Label>
                <Form.Control as="select" value={this.state.framework} onChange={this.handleFramework}>
                  <option>No idea</option>
                  <option>Library that provide ready code</option>
                  <option>Real or conceptual structure intended to serve as a support for the building apps</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="refactoring">
                <Form.Label>What the <i>refactoring</i> is?</Form.Label>
                <Form.Control as="select" value={this.state.refactoring} onChange={this.handleRefactoring}>
                  <option>No idea</option>
                  <option>Transforms a mess into clean code and simple design</option>
                  <option>Changes the logic in the code</option>
                </Form.Control>
              </Form.Group>
              <Button variant="info" onClick={() => this.handleSubmit('survey')}>Relative assessment</Button>
              <Button variant="info" className="Absolute-button"
                      onClick={() => this.handleSubmit('absolute-survey')}>Absolute assessment</Button>
            </Form>
          </div>
        </div>
    );
  }
}
