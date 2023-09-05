const app = require('./app')
require('dotenv').config()
const connectWithDB = require('./config/database')
const cld = require("cloudinary")

connectWithDB()

cld.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

app.listen(process.env.PORT,()=>{
    console.log("Server is running")
})