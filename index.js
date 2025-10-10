import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import route from './routes/userRoute.js'
import pdfRouter from './routes/pdfUploadRoute.js'


const app = express()
app.use(bodyParser.json())
dotenv.config()
app.use(cors())
app.use("/uploads", express.static("uploads")); // serve pdfs statically


const PORT = process.env.PORT || 7000
const MONGOURL = process.env.MONGO_URL

mongoose
.connect(MONGOURL)
.then(() => {
    console.log('DB connected successfully')
    app.listen(PORT, () => {
        console.log(`server is running on port :${PORT}`)
    })
})
.catch((error) => console.log(error))
 

app.use('/api/', route)
app.use('/api/', pdfRouter)