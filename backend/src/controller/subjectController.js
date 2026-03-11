import { myDataSource } from "../config/db.js"
import { Subject } from "../model/academicModel.js"

const subjectRepo = await myDataSource.getRepository("Subject")

export const createSubjects =async (req, res) => {

    const { subjectName, gradeLevel} = req.body

    if(!subjectName || !gradeLevel) {
        return res.json({
            code: 404,
            data: "Enter all fields"
        })
    }

    const subject  =  subjectRepo.create({
        subjectName,
        gradeLevel
    })

    await subjectRepo.save(subject)

    return res.json({
        code: 200,
        messsage: "subject added",
        data: subject
    })


}


export const getSubjects = async(req,res) => {


    const subjects = await subjectRepo.find({
            order: {
                subjectId: "ASC"
            }
        });

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
}