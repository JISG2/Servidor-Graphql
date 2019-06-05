var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'encuestasdb',
    port: '3306'
})

connection.connect();

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'encuestasdb'
    }
  });



const getEncuestas = () =>{
    return new Promise((resolve,reject)=>{
        let sql = "SELECT * from encuestas;"
        connection.query(sql,(err,results)=>{
            if(err)reject(err)
            resolve(results)
        })
    })
   
};

const getEncuestaID = (id) =>{
    return new Promise((resolve,reject)=>{
        return knex.select().from('encuestas').where("idencuesta",id).then((response)=>{
            resolve(response)  
            return response        
        })
        .catch((error)=>{
            console.log(error); throw error
        })
        
    })
}

//connection.end();
const agregarEncuesta = (nombre,descripcion,status,encuesta)=>{
    console.log("Agregando encuesta..."+nombre+descripcion) 
    return knex('encuestas').insert({nombre: nombre, descripcion: descripcion,status:status,encuesta:encuesta}).then((response)=>{
        console.log("response",response)
        let respuesta = {idencuesta: response[0], nombre: nombre, descripcion:descripcion,status: status,encuesta}
        console.log("respuesta: ",respuesta)
        return respuesta
    })
}

const eliminarEncuesta = (id) =>{
    console.log("delete "+id.id)
    knex('encuestas').where('idencuesta', id.id).del().then((response)=>{
        console.log(response)
    }).catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });
}


const updateEncuesta = (idencuesta,nombre,descripcion,status,encuesta)=>{
    console.log("Actualizando encuesta..."+idencuesta+nombre) 
    return knex('encuestas').where('idencuesta',idencuesta).update({nombre: nombre, descripcion: descripcion,status:status,encuesta:encuesta}).then((response)=>{
        console.log("response",response)
        let respuesta = {idencuesta:idencuesta, nombre: nombre, descripcion:descripcion,status: status,encuesta: encuesta}
        console.log("respuesta: ",respuesta)
        return respuesta
    })
}


module.exports={
    getEncuestas,
    getEncuestaID,
    agregarEncuesta,    
    eliminarEncuesta,
    updateEncuesta,
    
};
