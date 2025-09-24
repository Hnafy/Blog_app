import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const DBURI = `${process.env.MONGODB_URI}`
const connection = ()=>{
  mongoose.connect(DBURI).then(()=>{
    console.log("Good Connection")
  }).catch(()=>{
    console.log("Bad connection")
  })
}

export default connection