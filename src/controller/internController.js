const internModel = require('../models/internModel')
const collageModel = require('../models/collegeModel')
const Valid = require('../../validation/validation');
const collegeModel = require('../models/collegeModel');

const regName = /^[A-Z a-z]+$/
const regforNo = /^[0-9]{10}$/;
const regforemail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const createIntern = async function (req, res) {
    try {
        if(Object.keys(req.body).length==0) return res.status(400).send({ status: false, message: "Data Not given" })
        
        const { name, mobile, email, collegeName } = req.body

        if (!Valid.isValid(name)) return res.status(400).send({ status: false, message: "name is mendatory" })
        if(!regName.test(name)) return res.status(400).send({ status: false, message: "name is invilid" })

        if (!Valid.isValid(email)) return res.status(400).send({ status: false, message: "email is mendatory" })
        if(!regforemail.test(email)) return res.status(400).send({ status: false, message: "email is invilid" })
        let foundEmail = await internModel.findOne({email:email})
        if(foundEmail) return res.status(400).send({ status: false, message: "Email is already exist" })

        if (!Valid.isValid(mobile) ) return res.status(400).send({ status: false, message: "Mobile is mendatory" })
        if(!regforNo.test(mobile)) return res.status(400).send({ status: false, message: "Mobile is invilid" })
        let foundMobile = await internModel.findOne({mobile:mobile})
        if(foundMobile) return res.status(400).send({ status: false, message: "Mobile Number is already exist" })

        if (!Valid.isValid(collegeName)) return res.status(400).send({ status: false, message: "collegeName is mendatory" })

        let collegeDetails = await collageModel.findOne({ name: collegeName })
        if (!collegeDetails) return res.status(400).send({ status: false, message: "college is not exist" })

        req.body.collegeId = collegeDetails._id

        let savedData = await internModel.create(req.body)
        res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createIntern }