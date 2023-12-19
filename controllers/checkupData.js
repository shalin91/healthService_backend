const CheckupData = require("../models/checkupData");
const { ObjectId } = require("mongodb");

exports.addCheckupData = async (req, res) => {
  try {
    const data = req.body;

    console.log(data);


    // const { checkupName } = req.body;
    const { employeeId, companyId, location, checkupNameId, checkupTypeId , employeeContactDetailsId } =
      req.body;

    // const isPresent = await CheckupData.findOne({ checkupName });

    // if (isPresent) {

    //     return res.status(201).json({ message: "alredy registered" });

    // }


    const newCheckUpData = new CheckupData({
      ...data,
      companyId: new ObjectId(companyId),
      checkupNameId: new ObjectId(checkupNameId),
      checkupTypeId: new ObjectId(checkupTypeId),
      employeeId: new ObjectId(employeeId),
      employeeId: new ObjectId(employeeId),
      employeeContactDetailsId: new ObjectId(employeeContactDetailsId),
      location: location,
    });

    console.log(newCheckUpData);

    newCheckUpData

      .save()

      .then(() => {
        res.status(201).json({ data: newCheckUpData });
      })
      .catch((err) => {
        console.error("Error saving checkup data", err);

        res
          .status(500)
          .json({ error: "Error saving checkup data", details: err });
      });
  } catch (error) {
    console.error("Internal server error:", error);


    res.status(500).json({ error: "Internal server error" });
  }

};

exports.updateCheckupData = async (req, res) => {
  try {
    const data = req.body;

    console.log("-----");

    // const { checkupName } = req.body;

    // const isPresent = await CheckupData.findOne({ checkupName });

    // if (isPresent) {

    //     return res.status(201).json({ message: "alredy registered" });

    // }

    const newCheckUpData = new CheckupData(data);

    newCheckUpData

      .save()

      .then(() => {
        res.status(201).json({ data: newCheckUpData });
      })
      .catch((err) => {
        console.error("Error saving checkup data", err);

        res
          .status(500)
          .json({ error: "Error saving checkup data", details: err });
      });
  } catch (error) {
    console.error("Internal server error:", error);


    res.status(500).json({ error: "Internal server error" });
  }

};

exports.getFilteredCheckupData = async (req, res) => {
  try {
      const { companyId, location, checkupNameId, checkupTypeId, startDate, endDate } = req.query;

      const filters = {};

      if (companyId) filters.companyId = new ObjectId(companyId);
      if (location) filters.location = location;
      if (checkupNameId) filters.checkupNameId = new ObjectId(checkupNameId);
      if (checkupTypeId) filters.checkupTypeId = new ObjectId(checkupTypeId);

      if (startDate && endDate) {
          filters.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const aggregationPipeline = [
          {
            '$lookup': {
              'from': 'checkupnames', 
              'localField': 'checkupNameId', 
              'foreignField': '_id', 
              'as': 'checkupname'
            }
          }, {
            '$unwind': {
              'path': '$checkupname', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$lookup': {
              'from': 'companies', 
              'localField': 'companyId', 
              'foreignField': '_id', 
              'as': 'compani'
            }
          }, {
            '$unwind': {
              'path': '$compani', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$lookup': {
              'from': 'employeecontactdetails', 
              'localField': 'employeeContactDetailsId', 
              'foreignField': '_id', 
              'as': 'employeecontactdetails'
            }
          }, {
            '$unwind': {
              'path': '$employeecontactdetails', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$lookup': {
              'from': 'checkuptypes', 
              'localField': 'checkupTypeId', 
              'foreignField': '_id', 
              'as': 'checkupType'
            }
          }, {
            '$unwind': {
              'path': '$checkupType', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$lookup': {
              'from': 'employees', 
              'localField': 'employeeId', 
              'foreignField': '_id', 
              'as': 'employeeData'
            }
          }, {
            '$unwind': {
              'path': '$employeeData', 
              'includeArrayIndex': 'string', 
              'preserveNullAndEmptyArrays': true
            }
          }
        ]

      const checkupData = await CheckupData.aggregate([...aggregationPipeline, { $match: filters }]).exec();

      res.status(200).json({ data: checkupData });
  } catch (error) {
      console.error("Error getting filtered checkup data", error);
      res.status(500).json({ error: "Internal server error" });
  }
};
