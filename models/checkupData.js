const mongoose = require("mongoose");

const checkupDataSchema = new mongoose.Schema({
    
    checkupNameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckupName",
    },

    checkupTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckupType",
    },

    checkupDate: {
        type: String,
    },

    location:{
        type: String
    },

    employeeContactDetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmployeeContactDetails",
      },
      
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    },

    employeeReports : {

        employeeEyeDetailsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeEyeInformation",
            default:null
        },
    
        employeeInvestigationDetailsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeInvestigationInformation",
            default:null
        },

        employeeBloodInvestigationDetailsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeBloodInformation",
            default:null
        },

        employeeVitalAndHistoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeVitalsAndHistory",
            default:null
        },

        employeeForm32Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeForm32",
            default:null
        },

        employeeForm33Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeForm33",
            default:null
        },
    
        employeeGenerelExaminationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EmployeeGeneralExamination",
            default:null
        },

    }

    //other changes remaining
});


module.exports = mongoose.model("CheckupData", checkupDataSchema);