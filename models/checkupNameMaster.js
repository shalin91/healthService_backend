const mongoose = require("mongoose");
const checkupNameMasterSchema = new mongoose.Schema({
  checkupName: {
    type: String,
  },
  checkupNumber: {
    type: String,
  },
  checkupDate: {
    type: String,
  },
  checkupType: {
    type: String,
    ref:'CheckupType'
  },
});
module.exports = mongoose.model("CheckupNamenew", checkupNameMasterSchema);
