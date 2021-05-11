# Assignment Task for api call with postgresql

## Dependency 
 - Need to Install PostgreSql 
 - Create Db and insert data by refering schema in api/schema/explorer.js file.

## Installation Setps
  - git clone https://github.com/bhosale05/assignment.git
  - npm Install

## Configuration 
  - add database credential in config file like username, password, port
  - also enter express server port to run app
  
## Executation setps
  - node index.js

## Sample OutPut : 
 ### if you trigger api call =  https://localhost/explorer
    - get all data in clients, projects, costs and cost_types
 
 ### if you trigger api call = https://localhost/explorer?clientid=1
    - get data by id, above api call get clientid = 1 data
  
 ### if you trigger api call = https://localhost/explorer?clientid=1&projectid=2
    -  get data from clients which has clientid = 1 and fetch data from projects which has projectid = 2 and fetch overall data from costs and cost_types
  