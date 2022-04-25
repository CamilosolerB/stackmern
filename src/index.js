const express = require('express');
const morgan = require('morgan');
const path = require('path')
const app = express();

const {mongoose} = require('./database')
//settings
app.set('port', process.env.PORT || 4000);

//middleware
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/task',require('./routes/task.routes'))

//static files
app.use(express.static(path.join(__dirname,'public')))

//iniciar el servidor
app.listen(app.get('port'), ()=>{
    console.log(`Server on port ${app.get('port')}`);
})