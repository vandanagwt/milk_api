var mysql = require('mysql');
var MySQLConnection = {};
var MySQLConPool = {};

var USER = 'root';
var PWD = '';
var DATABASE = 'mine';
var DB_HOST_NAME = 'localhost';

// const USER = 'mykisaankart_user';
// const PWD = 'C]op0X_iqlDxenU?';
// var DATABASE = 'mykisaankart_db';
// var DB_HOST_NAME = 'localhost';


var MAX_POOL_SIZE = 100;
var MIN_POOL_SIZE = 50;

var MySQLConPool = mysql.createPool({
    host: DB_HOST_NAME,
    port: 3306,
    user: USER,
    password: PWD,
    database: DATABASE,
    connectTimeout: 20000,
    connectionLimit: MAX_POOL_SIZE,
    debug: false,
    multipleStatements: true
});


exports.MySQLConPool = MySQLConPool;