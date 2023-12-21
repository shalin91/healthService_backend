const EmployeeBloodInformation = require("../models/employeeBloodInvestigationInformation");
const CheckupData = require("../models/checkupData");
const { ObjectId } = require("mongodb");

exports.addEmpBloodInformation = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const { checkupDataId } = req.body;
    console.log(req.body);
    const empID = new ObjectId(checkupDataId);

    const newBloodInformation = new EmployeeBloodInformation(data);

    newBloodInformation
      .save()
      .then(() => {
        return res.status(201).send({
          data: newBloodInformation,
          message: "empy blood info added successfully",
        });
      })
      .catch((err) => {
        console.error("Error saving blood info :", err);
        res
          .status(500)
          .json({ error: "Error saving blood info ", details: err });
      });

    const newid = newBloodInformation._id;

    await CheckupData.findByIdAndUpdate(
      { _id: empID },

      { $set: { "employeeReports.employeeBloodInvestigationDetailsId": newid } }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
