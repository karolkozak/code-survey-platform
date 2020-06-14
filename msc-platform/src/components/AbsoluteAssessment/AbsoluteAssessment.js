import * as React from "react";
import Button from "react-bootstrap/Button";
import CodeListing from "../CodeListing/CodeListing";
import './AbsoluteAssessment.css';
import Survey from "../../models/survey";
import RestApi from "../../services/rest-api";
import {Redirect} from "react-router-dom";

export default class AbsoluteAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      currentExample: {
        id: undefined,
        time: 0,
        code: []
      }
    };
    this.surveyObject = new Survey();
    this.emptyUserData = !window.localStorage.getItem('userData');
    this.noMoreExamples = false;
    this.currentExampleIndex = 0;
    this.restApi = new RestApi();
  }

  componentDidMount() {
    this.fetchCodeExample();
  }

  fetchCodeExample() {
    this.restApi.getAbsoluteCode(++this.currentExampleIndex).then(res => {
      this.setState({currentExample: res.data});
      this.setState({startTime: new Date().getTime()})
    }).catch(e => {
      this.surveyObject.surveyTime = this.surveyObject.answers.reduce((total, ans) => total + ans.time, 0);
      this.restApi.postAbsoluteAnswers(this.surveyObject).then(res => {
        this.noMoreExamples = true;
        this.setState({
          currentExample: {
            id: undefined,
            time: 0,
            code: []
          }
        });
      });
    });
  }

  handleResponse = (assessment) => {
    console.log(assessment);
    const time = (new Date().getTime()) - this.state.startTime;
    this.surveyObject.answers.push({
      exampleId: this.state.currentExample.id,
      assessment: assessment,
      time: time
    });
    window.scrollTo(0, 0);
    this.fetchCodeExample();
  };

  render() {
    if (this.emptyUserData) {
      return (<Redirect to="/" push={true}/>);
    } else if (this.noMoreExamples) {
      return (<Redirect to="/grateful" push={true}/>);
    }
    return (
        <div className="Absolute-Survey-Page">
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-8 Code-Container">
              {this.state.currentExample.code.map((code, i) =>
                  <CodeListing key={i} code={code}/>
              )}
              <span className="Label">Poor quality</span>
              <Button variant="info" className="Assessment" onClick={() => this.handleResponse(1)}>1</Button>
              <Button variant="info" className="Assessment" onClick={() => this.handleResponse(2)}>2</Button>
              <Button variant="info" className="Assessment" onClick={() => this.handleResponse(3)}>3</Button>
              <Button variant="info" className="Assessment" onClick={() => this.handleResponse(4)}>4</Button>
              <Button variant="info" className="Assessment" onClick={() => this.handleResponse(5)}>5</Button>
              <span className="Label">Good quality</span>
            </div>
            <div className="col-md-2"></div>
          </div>
        </div>
    );
  }
}
