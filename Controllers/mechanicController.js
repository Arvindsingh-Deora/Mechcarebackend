const Mechanic = require("../models/mechanic");

const registerMechanic = async (req, res) => {
  try {
    const newMech = new Mechanic(req.body);
    await newMech.save();
    res.status(201).json(newMech);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMechanicsByCity = async (req, res) => {
  try {
    const { city } = req.query;
    const result = await Mechanic.find(city ? { city } : {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerMechanic, getMechanicsByCity };
