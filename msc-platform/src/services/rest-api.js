import axios from 'axios';

export default class RestApi {

    constructor() {
        this.baseUrl = 'http://msc.karkoz.usermd.net';
    }

    getCodeExample(id) {
        return axios.get(`${this.baseUrl}/code?ex=${id}`);
    }

    getAbsoluteCode(id) {
        return axios.get(`${this.baseUrl}/absolute?ex=${id}`);
    }

    postAnswers(answers) {
        return axios.post(`${this.baseUrl}/answer`, {answers});
    }

    postAbsoluteAnswers(answers) {
        return axios.post(`${this.baseUrl}/absolute-answer`, {answers});
    }
}
