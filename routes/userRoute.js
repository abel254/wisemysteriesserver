import express from 'express'
import { create, sendBulkEmail  } from '../controller/userController.js'

const route = express.Router()

// Existing route
route.post('/user', create) 

// New admin-only bulk email route
route.post("/send-bulk-email", sendBulkEmail);

export default route