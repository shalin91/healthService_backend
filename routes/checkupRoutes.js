const express = require("express");
const {
  addCheckupType,
  getCheckupType,
} = require("../controllers/checkupTypeCtrl");
const {
  addCheckupName,
  getCheckupNames,
} = require("../controllers/checkupMasterCtrl");
const {
  addCheckupData,
  getFilteredCheckupData,
  getCheckupDataById,
} = require("../controllers/checkupData");

const {
  addCheckupName1, getCheckupName,
}=require("../controllers/checkupNameCtrl")
const router = express.Router();

router.post("/add-checkup-type", addCheckupType);
router.post("/add-checkup-name", addCheckupName);
router.post("/add-checkup-data", addCheckupData);
router.get("/get-all-checkup-type", getCheckupType);
router.get("/get-all-checkup-data", getFilteredCheckupData);
router.get("/get-checkup-name", getCheckupNames);
router.get("/get-checkupdata/:id", getCheckupDataById);
//vaishal...
router.post("/add-checkupname-master",addCheckupName1);
router.get("/get-checkupname-master",getCheckupName)
module.exports = router;
