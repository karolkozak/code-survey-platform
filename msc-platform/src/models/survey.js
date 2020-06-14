export default class Survey {
  constructor() {
    this.id = '_' + Math.random().toString(36).substr(2, 9);
    this.surveyTime = 0;
    this.userData = JSON.parse(window.localStorage.getItem('userData'));
    this.answers = [];
  }
}
