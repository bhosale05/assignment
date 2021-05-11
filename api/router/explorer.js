const express = require('express');
const con = require('postgresql-client')
const router = express.Router();
const config = require('../../config.json');
const credential = config.credential;
let connection;
let bunyan = require('bunyan');
const log = bunyan.createLogger({ name: `explorer`, level: 20});


async function connectToSQL() {

    connection = new con.Pool({
        host: credential.host,
        user: credential.username,
        password: credential.password,
        pool: {
           min: 1,
           max: 10,
           idleTimeoutMillis: 5000
        }
    })
}

connectToSQL();

function createJson(data, type) {
    const fields =  data.fields;
    const rows =  data.rows;
    let jsonData = [];
    for(let r = 0; r < rows.length; r++) {
        let record = {};
        for(let f = 0; f < fields.length; f++) {
            record[fields[f].fieldName] = rows[r][f];
        }
        record.type = type;
        jsonData.push(record);
    }
    return jsonData;
}

async function query() {
    let exploreItems = [];
    try{
        let client = await connection.query(
            `select * from clients`);
            client = createJson(client, 'client');
            exploreItems.push({client: client});
        let project = await connection.query(
            `select * from projects`);
            project = createJson(project, 'project');
            exploreItems.push({project: project});
        let cost = await connection.query(
            `select * from costs`);
            cost = createJson(cost, 'cost');
            exploreItems.push({cost: cost});
        let cost_type = await connection.query(
            `select * from cost_types`);
            cost_type = createJson(cost_type, 'cost_type');
            cost_type = sortCostType(cost_type, cost);
        return {result:exploreItems};
    } catch(ex) {
        return {error: ex};
    }
} 

async function queryById(clientid, projectid) {
    let exploreData = [];
    try{
        let client = await connection.query(
            'select * from clients where id ='+clientid);
            client = createJson(client, 'client');
            exploreData.push({client: client});
        let project = await connection.query(
            'select * from projects where id ='+projectid);
            project = createJson(project, 'project');
            exploreData.push({project: project});
        let cost = await connection.query(
            'select * from costs');
            cost = createJson(cost, 'cost');
            exploreData.push({cost: cost});
        let cost_type = await connection.query(
            'select * from cost_types');
            cost_type = createJson(cost_type, 'cost_type');
            cost_type = sortCostType(cost_type, cost);
        return {result:exploreData};
    } catch(ex) {
        return {error: ex};
    }
} 

function sortCostType(cost_type, cost) {
    let group = {};
    for(let c = 0; c < cost_type.length; c++) {
        if(!group[cost_type[c].id]){
            group[cost_type[c].id] = cost_type[c];
            group[cost_type[c].id].children = [];
        }
        for(let c1 = 0; c1 < cost_type.length; c1++) {
            if(cost_type[c1].parent_id && group[cost_type[c1].parent_id]) {
                group[cost_type[c].id].children.push(cost_type[c]);
            }
        }
    }
    return group;
}

router.get('/', async (req, res, next) => {
    log.info(`Request recived from client`);
    if(req.query.clientid && req.query.projectid){
        let result = await queryById(+req.query.clientid, +req.query.projectid);
        if(result.error) {
            res.status(500).json({
                error : error
            })
        } else {
            log.info(`send response to client`);
            res.status(200).json({
                result : result.result
            })
        }
    } else {
        let result = await query()
        if(result.error) {
            res.status(500).json({
                error : error
            })
        } else {
            log.info(`send response to client`);
            res.status(200).json({
                result : result.result
            })
        }
    }
    
})

module.exports = router