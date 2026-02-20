const mongoose = require('mongoose')


const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}

const connectionString = process.env.MONGO_URI

const connectDB = (url) =>{ 
    const Url = url || connectionString
   return mongoose.connect( Url, options)
        .then(()=> console.log('connected to the DB...'))
        .catch((error) => {
           console.log(`There was an error connnecting to the database`)
            console.log(error)
        })
        
        }


module.exports = connectDB
