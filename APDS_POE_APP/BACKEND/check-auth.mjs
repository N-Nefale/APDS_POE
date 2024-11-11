import jwt from  "jsonwebtoken";

const checkauth = (req, res, next) => {
    try{
        const token =req.headers.authorization.split(" ")[1];
      jwt.verify(token,"this_secret_should_be_longer_that_it_is")//Token-Based Authentication
      next();
    }
    catch(error){
        res.status(401).json({
        message:"token invalid"
    })
    }
};
export default checkauth;
