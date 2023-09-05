const mongoose = require("mongoose")
const connectWithDB = async () => {
    await mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }).then(
        ()=>{
            console.log("database connected")
        }
    ).catch((err)=>{
        console.log("error")
    })
}

module.exports = connectWithDB