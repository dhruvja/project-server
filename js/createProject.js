const fs = require('fs')
const anchor = require("@project-serum/anchor")
const {v4} = require("uuid");
const data = require('./config/data.json');

const projectId = v4();

data.projects.push({"id": projectId});
fs.writeFileSync('./config/data.json', JSON.stringify(data))   
