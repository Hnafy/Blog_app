import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export let verifyToken = (req, res, next) => {
    let token = req.headers.token;
    if (token) {
        try {
            let decoded = jwt.verify(req.headers.token, process.env.SECRET_KEY);
            req.user = decoded;
            next()
        } catch (err) {
            res.status(404).send({ message: "invalid token" });
        }
    } else {
        res.status(404).send({ message: "token isn't exist" });
    }
};

let authentication = (req,res,next)=>{
  if(req.user.id == req.params.id || req.user.isAdmin){
    // console.log("first:"+ req.user.id == req.params.id ,"second:"+ req.user.isAdmin)
    next()
  }else{
    res.status(404).send({ message: "you don't authenticated" });
  }
}

let verifyTokenAndAuthentication = [verifyToken,authentication]

export default verifyTokenAndAuthentication