import mongoose from 'mongoose'


const DBURI = "mongodb+srv://ahmednaser7530:f1ogjNUGAKqnKDpk@cluster0.std8ned.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connection = ()=>{
  mongoose.connect(DBURI).then(()=>{
    console.log("Good Connection")
  }).catch(()=>{
    console.log("Bad connection")
  })
}

export default connection