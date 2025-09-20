import mongoose from 'mongoose'

const userModel = mongoose.Schema({
  user:{
    type:String,
    min:3,
    max:100
  },
  email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    min:3,
    max:100
  },
  password:{
    type:String,
    required:true,
    trim:true,
    min:3,
  },
  isAdmin:{
    type:Boolean,
    default:false
  },
  profilePhoto:{
    type:Object,
    default:{
      avatar:"",
      publicId: null
    }
  },
  bio:String
},{
  timeStamps:true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

userModel.virtual("posts",{
  ref:"post",
  localField:"_id",
  foreignField:"user"
})

export default mongoose.model("user",userModel)