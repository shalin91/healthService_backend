const CheckupName = require("../models/checkupNameMaster")
exports.addCheckupName1 = async (req, res) => {
    try {
        const data = req.body;

        console.log("-----")

        const { checkupName } = req.body;

        const isPresent = await CheckupName.findOne({ checkupName });
        
        if (isPresent) {
            return res.status(201).json({ message: "alredy registered" });
        }

        const newCheckUpName = new CheckupName(data);

        newCheckUpName
            .save()
            .then(() => {
                res.status(201).json({ message: "checkup added successfully" });
            })
            .catch((err) => {
                console.error("Error saving checkup type", err);
                res.status(500).json({ error: "Error saving checkup type", details: err });
            });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getCheckupName = async (req, res) => {
    try {

        const data = await CheckupName.find().then((data) => {
            res.status(201).json({ data: data });
        }).catch((error) => {
            console.error("Internal server error:", error);
            res.status(500).json({ error: "Internal server error" });
        });



    } catch (error) {

        console.error("Internal server error:", error);
        res.status(500).json({ error: "Internal server error" });

    }
}