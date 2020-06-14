import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./components/HomePage/HomePage";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import StarterForm from "./components/StarterForm/StarterForm";
import SmallHeader from "./components/SmallHeader/SmallHeader";
import AbsoluteAssesment from "./components/AbsoluteAssessment/AbsoluteAssessment";
import SurveyPage from "./components/SurveyPage/SurveyPage";
import GratefulPage from "./components/GratefulPage/GratefulPage";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Switch>
              <Route path="/absolute-survey">
                <SmallHeader></SmallHeader>
                <AbsoluteAssesment></AbsoluteAssesment>
              </Route>
              <Route path="/survey">
                <SmallHeader></SmallHeader>
                <SurveyPage></SurveyPage>
              </Route>
              <Route path="/grateful">
                <SmallHeader></SmallHeader>
                <GratefulPage></GratefulPage>
              </Route>
              <Route path="/form">
                <SmallHeader></SmallHeader>
                <StarterForm></StarterForm>
              </Route>
              <Route path="/">
                <HomePage></HomePage>
              </Route>
            </Switch>
          </div>
        </Router>

        <footer className="App-footer">
          Powered by Karol Kozak
        </footer>
      </div>
  );
}

export default App;
