import express from "express";
import { getSubjects, createSubjects } from "../controller/subjectController.js";



 const subjectRouter = express.Router()


// subjectRouter.route("/getSubjects").get(getSubjects)
subjectRouter.get("/getSubjects", getSubjects)
subjectRouter.route("/createSubjects").post(createSubjects)

export default subjectRouter