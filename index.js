const express = require('express');
const app = express();

var graphqlHTTP = require("express-graphql");
var {buildSchema} = require("graphql");
var {getEncuestas,getEncuestaID,agregarEncuesta,eliminarEncuesta,updateEncuesta} = require("./data/encuestas");

var cors = require("cors"); //Para mezclar el acceso de un cliente a un API

//Construct a schema, using GrapQL schema language
var schema = buildSchema(`
scalar JSON
    type Encuesta{
        nombre: String,
        descripcion: String
        idencuesta: Int, 
        status: String,
        encuesta : JSON
    },
    type Query{
        hello: String,
        encuestas: [Encuesta],
        encuesta(id:Int!): [Encuesta],
    },
    type Mutation{
        agregarEncuesta(nombre:String!,descripcion:String!,status:String!,encuesta:JSON!):Encuesta,
        eliminarEncuesta(id:Int!): Encuesta,
        updateEncuesta(idencuesta:Int!,nombre:String!,descripcion:String!,status:String!,encuesta:JSON!):Encuesta,
    }
`);

var root = {
    hello:()=>{
        return "Hello world!";
    },
    encuestas:()=>{
        return getEncuestas();
    },
    encuesta:({id})=>{
        return  getEncuestaID(id);
    },
    agregarEncuesta: args =>{
        const {nombre,descripcion,status,encuesta}=args;
        return agregarEncuesta(nombre,descripcion,status,encuesta);
    },   
    eliminarEncuesta: args =>{
        const id = args;
        return eliminarEncuesta(id);
    },    
    updateEncuesta: args =>{
        const {idencuesta,nombre,descripcion,status,encuesta}=args;
        return updateEncuesta(idencuesta,nombre,descripcion,status,encuesta);
    }            
};

//Add cors
app.use(cors());

app.use(
    "/graphql",
    graphqlHTTP({
        schema:schema,
        rootValue:root,
        graphiql:true
    })
);

app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000")
