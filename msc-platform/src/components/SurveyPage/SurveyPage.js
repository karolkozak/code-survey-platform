import * as React from "react";
import Button from "react-bootstrap/Button";
import CodeListing from "../CodeListing/CodeListing";
import './SurveyPage.css';
import Survey from "../../models/survey";
import {Redirect} from "react-router-dom";
import RestApi from "../../services/rest-api";

export default class SurveyPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      currentExample: {
        id: undefined,
        time: 0,
        before: [],
        after: []
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
    this.restApi.getCodeExample(++this.currentExampleIndex).then(res => {
      this.setState({currentExample: res.data});
      this.setState({startTime: new Date().getTime()})
    }).catch(e => {
      this.surveyObject.surveyTime = this.surveyObject.answers.reduce((total, ans) => total + ans.time, 0);
      this.restApi.postAnswers(this.surveyObject).then(res => {
        this.noMoreExamples = true;
        this.setState({
          currentExample: {
            id: undefined,
            time: 0,
            before: [],
            after: []
          }
        });
      });
    });
  }

  handleBeforeResponse = () => {
    const time = (new Date().getTime()) - this.state.startTime;
    this.surveyObject.answers.push({
      exampleId: this.state.currentExample.id,
      assessment: 0,
      time: time
    });
    window.scrollTo(0, 0);
    this.fetchCodeExample();
  };

  handleAfterResponse = () => {
    const time = (new Date().getTime()) - this.state.startTime;
    this.surveyObject.answers.push({
      exampleId: this.state.currentExample.id,
      assessment: 1,
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
        <div className="Survey-Page">
          <div className="row">
            <div className="col-md-6 Code-Container">
              {this.state.currentExample.before.map((code, i) =>
                  <CodeListing key={i} code={code}/>
              )}
              <Button variant="info" onClick={this.handleBeforeResponse}>The left one is better</Button>
            </div>
            <div className="col-md-6 Code-Container">
              {this.state.currentExample.after.map((code, i) =>
                  <CodeListing key={i} code={code}/>
              )}
              <Button variant="info" onClick={this.handleAfterResponse}>The right one is better</Button>
            </div>
          </div>
        </div>
    );
  }
}
