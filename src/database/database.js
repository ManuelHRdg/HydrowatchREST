import mysql from "promise-mysql";
import config from "./../config.js";

const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password
});

const getConnection = () => {
    return connection;
};

/* module.exports = {
    getConnection
};
 */
export const dbConnection = {
    getConnection
};