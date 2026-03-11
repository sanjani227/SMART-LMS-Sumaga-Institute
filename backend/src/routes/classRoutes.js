import express from 'express'
import { createClasses, getClasses,updateClass } from '../controller/classController.js'


const classRoute = express.Router()




classRoute.get("/getClasses",getClasses)
classRoute.post("/createClass",createClasses)
classRoute.post('/updateClass' ,updateClass)


export default classRoute

