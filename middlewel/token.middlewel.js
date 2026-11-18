import jwt from "jsonwebtoken";

export const tokenauth = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return res.status(404).json({message: "token not found?"});

    jwt.verify(token, process.env.tokencode, (error, payload) => {
        if(error) return res.status(401).json({message: "token not correct or missing"});
        req.tokeninfo = payload;
    });
    next()
};