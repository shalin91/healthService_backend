const CheckupName = require("../models/checkupMaster");

exports.addCheckupName = async (req, res) => {
  try {
    const data = req.body;

    console.log("-----");

    console.log(data.data);

    const { checkupName } = req.body;

    const isPresent = await CheckupName.findOne({ checkupName });

    if (isPresent) {
      return res.status(201).json({ message: "alredy registered" });
    }

    const newCheckUpName = new CheckupName(data.data);

    console.log("---new form--");

    console.log(newCheckUpName);

    newCheckUpName

      .save()

      .then((data) => {
        res.status(201).json({ data: data });
      })
      .catch((err) => {
        console.error("Error saving checkup type", err);

        res
          .status(500)
          .json({ error: "Error saving checkup name", details: err });
      });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getCheckupNames = async (req, res) => {
  try {
    const uniqueCheckupNames = await CheckupName.distinct("_id").exec();

    const checkupNamesData = await CheckupName.find({
      _id: { $in: uniqueCheckupNames },
    }).exec();

    res.status(200).json({ data: checkupNamesData });
  } catch (error) {
    console.error("Error getting unique checkup names", error);
    res.status(500).json({ error: "Internal server error" });
  }

};
