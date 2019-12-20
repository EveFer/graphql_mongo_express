const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://localhost/coursesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false})
  .then(() => { 
      console.log('Conection a MongoDB Success') 

      app.listen(3131, ()=>{
        console.log('Escuchando del puerto: 3131')
      })

    })
  .catch(err => console.log(`{error: ${err}}`))


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true

}))

