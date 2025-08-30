import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'

const port = process.env.PORT || 4000;


;(async () => {
    try {
        
        
        app.listen(port, () => {
            console.log(`App is up and running on port ${port}`);
        })
    }
    catch (err) {
        console.log(err);
        console.error('Unable to start the server:', err);
    }
})()