const express = require('express')
const app = express()
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
//swagger documentation
const fs =require('fs')
const swaggerUi = require('swagger-ui-express');
const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const YAML = require('yaml')
const swaggerDocument = YAML.parse(file)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middlewarre
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//cookie middleware
app.use(cookieParser())


//morgan middlware
app.use(morgan('tiny'))

//for images
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp"
}))

//import all routes here
const user = require('./routes/userRoutes')
const product =  require('./routes/productRoutes')
const order  = require('./routes/orderRoutes')

//routes
app.use('/api/v1',user)
app.use('/api/v1',product)
app.use('/api/v1',order)
app.get('/signuptest',(req,res) =>{
    res.render('signuptest')
})


module.exports = app