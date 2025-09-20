import fs from 'fs'
import path, { dirname } from 'path';
import { fileURLToPath } from "url"

let cleanUploads=(filename)=>{
  const __dirname = dirname(fileURLToPath(import.meta.url));
  let imagepath = path.join(__dirname,`/${filename}`)
  fs.unlinkSync(imagepath)
}

export default cleanUploads