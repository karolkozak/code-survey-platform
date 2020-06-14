const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const ex = require('./examples');
const examples = ex.examples;

const abs_ex = require('./absolute-examples');
const abs_examples = abs_ex.examples;

const config = require('./config');
const url = config.data.db_access;
const dbName = config.data.db_name;

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let db;
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);

});

app.get('/code', (req, res) => {
    const id = req.query.ex;
    if (examples.hasOwnProperty(id)) {
        const example = examples[id];
        delete example['better'];
        return res.status(200).send(example);
    }
    return res.status(404).send();
});

app.get('/absolute', (req, res) => {
    const id = req.query.ex;
    if (abs_examples.hasOwnProperty(id)) {
        const example = abs_examples[id];
        return res.status(200).send(example);
    }
    return res.status(404).send();
});

app.post('/answer', (req, res) => {
    const data = req.body;
    db.collection('results').insertOne(data).then(dbResult => {
        res.status(201).send({
            success: 'true',
            data: dbResult,
        });
    }).catch(err => {
        res.status(500).send({
            data: err
        });
    });
});

app.post('/absolute-answer', (req, res) => {
    const data = req.body;
    db.collection('absolute-results').insertOne(data).then(dbResult => {
        res.status(201).send({
            success: 'true',
            data: dbResult,
        });
    }).catch(err => {
        res.status(500).send({
            data: err
        });
    });
});

const server = http.createServer(app);
server.listen(3000);
