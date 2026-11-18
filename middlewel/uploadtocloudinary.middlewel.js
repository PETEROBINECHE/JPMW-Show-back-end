import {v2 as cloudinary} from "cloudinary";

cloudinary.config({ 
  cloud_name: process.env.my_cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret
});


const uploadtocloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({resource_type: "image"}, 
            (error, result) => {
                if(error){
                    return reject(error);
                }
            resolve(result) 
        });
        stream.end(buffer);
    })
};

export default uploadtocloudinary;