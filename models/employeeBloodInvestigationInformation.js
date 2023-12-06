const mongoose = require("mongoose");

const employeeBloodInformationSchema = new mongoose.Schema({

    companyId :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },

    employeeId :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },

    checkupNameId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckupName"
    },

    checkupTypeId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckupType"
    },

    checkupDataId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckupData"
    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    
    checkupNameID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckupName"
    },

    hb: {
        type: String,

    },
    rbc: {
        type: String,
    },
    wbc: {
        type: String
    },
    differentialCount: {
        type: String,
    },
    plateletCount: {
        type: String,
    },
    esr:
    {
        type: String,
    },
    biGroup:
    {
        type: String,
    },

    biSugarFastingOrRandom:
    {
        type: String,
    },
    biSugarPP2BS:
    {
        type: String,
    },
    biUrea:
    {
        type: String,
    },
    bun:
    {
        type: String,
    },
    sCreatinine:
    {
        type: String,
    },

    sgpt:
    {
        type: String,
    },

    sgot:
    {
        type: String,
    },

    sBilirubinTotal:
    {
        type: String,
    },

    sBilirubinDirect:
    {
        type: String,
    },

    sBilirubinIndirect:
    {
        type: String,
    },

    sProteins:
    {
        type: String,
    },

    alklinePhosphatase:
    {
        type: String,
    },

    albumin:
    {
        type: String,
    },

    globulin:
    {
        type: String,
    },

    sodium:
    {
        type: String,
    },

    potassuim:
    {
        type: String,
    },

    chloride:
    {
        type: String,
    },

    urineRAndM: {

        proein: {
            type: String
        },

        glucose: {
            type: String
        },

        ketone: {
            type: String
        },

        bileSalts: {
            type: String
        },

        bilePigments: {
            type: String
        },

        pusCells: {
            type: String
        },

        redCells: {
            type: String
        },

        epiCells: {
            type: String
        },

        cast: {
            type: String
        },

        crystals: {
            type: String
        },


    }



    //other changes remaining
});


module.exports = mongoose.model("EmployeeBloodInformation", employeeBloodInformationSchema);