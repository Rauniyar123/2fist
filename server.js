/*..............import dependancies..............*/
const http=require('http');
const app=require('./app');//import app file here
const server=http.createServer(app);
const mongoose=require('mongoose');
require('dotenv').config();



/*.............mongodb database connection on atlas.........*/
const url =process.env.URL;

mongoose.connect(url)
    .then( () => {
        console.log('Connected to databases ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })



/*.................connet to server..............*/
const port =process.env.PORT;
server.listen(port,(error)=>{
	if(error){
		console.log(error)
	}else{
		console.log(`The server is connected sucessfully on port number ${port}`)
	}

});