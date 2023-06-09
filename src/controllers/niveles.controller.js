import {dbConnection as db} from "./../database/database.js";


const getNiveles = async(req, res) => {

    try{
        const {nombreTanque, fecha} = req.params;
        const filter = [nombreTanque, fecha];
        const getConnection = await db.getConnection();
        const result = await getConnection.query("SELECT nivel, HOUR(fecha) as tiempo FROM reportesTanques WHERE tanqueName=? AND DATE(fecha)=?", filter);
        //'2023-06-02'
        console.log(result);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(result);

    }catch(error){

        res.status(500);
        res.send(error.message);

    }
    //res.json("Aloha - asies");
};

const getNivel = async(req, res) => {

    try{
        console.log(req.params);
        const {nombreTanque} = req.params;
        const getConnection = await db.getConnection();
        const result = await getConnection.query("SELECT nivel, HOUR(fecha) as tiempo FROM reportesTanques WHERE tanqueName=? order by fecha DESC limit 1", nombreTanque);
        console.log(result);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(result);

    }catch(error){

        res.status(500);
        res.send(error.message);

    }

};

const llenarTanque = async(req, res) => {
    try{

        const { tanqueName, nivel } = req.body;
        if(tanqueName == undefined || nivel == undefined){
           return res.status(400).json({ message: "Bad request. Fields are incomplete." });
        }
        console.log(req.body);
        const getConnection = await db.getConnection();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(req.body);

    }catch(error){

        res.status(500);
        res.send(error.message);

    }
};

const saludar = async(req, res) => {
    console.log("Hola desde REST");
    res.status(200).send({msg: `Hola desde REST`});
};

export const methods = {
    getNiveles,
    getNivel,
    llenarTanque,
    saludar
};