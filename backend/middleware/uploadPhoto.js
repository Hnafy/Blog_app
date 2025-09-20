import multer from "multer";


// upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    if(file){
      cb(null, Date.now() + "-" + file.originalname);
    }else{
      cb(null,false)
    }
  }
});
// image middleware
const uploadPhoto = multer({ 
  storage:storage,
  fileFilter: function(req,file,cb){
    if(file.mimetype.startsWith("image")){
      cb(null,true)
    }else{
      cb({message:"unsupported this type file"},false)
    }
  },
  limits: {
    fileSize:1024 * 1024 * 5 // 5 megabyte
  }
});

export default uploadPhoto