
require('dotenv').config()
module.exports={
    mongoUrl:process.env.MONGO_URL,
    jwt_secret:process.env.SECRET_KEY
}
