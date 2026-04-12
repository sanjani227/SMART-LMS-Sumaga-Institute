import express from 'express'
import { createClasses, getClasses, updateClass, deleteClass } from '../controller/classController.js'


const classRoute = express.Router()




classRoute.get("/getClasses",getClasses)
classRoute.post("/createClass",createClasses)
classRoute.put("/updateClass/:id", updateClass)
classRoute.delete("/deleteClass/:id", deleteClass)

export default classRoute

