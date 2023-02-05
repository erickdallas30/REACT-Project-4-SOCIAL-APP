//initializing thr requirement of ENV, and JTW for the implementation of the jsonwebtoken
require('dotenv').config()
const jwt = require('jsonwebtoken')
const {SECRET} = process.env

// exporting isauthenticated function for the authentication proccess 
module.exports = {
    isAuthenticated: (req, res, next) => {
        const headerToken = req.get('Authorization') //build a token in the variable headertoken
    
        if (!headerToken) { //checking if token is presen if not will log an error message
            console.log('middleware auth error') 
            res.sendStatus(401)
        }
    
        let token

        try { //try-catch run token to verify it, if not detected, it wil catch the error and send it
            token = jwt.verify(headerToken, SECRET)
        } catch (err) {
            err.statusCode = 500
            throw err
        }

        if (!token) { //veryfin token not present , then will create and error and will be  place in the error variable to send it
            const error = new Error('NOT authenticated.')
            error.statusCode = 401
            throw error
        }
    
        next()
    }
}



