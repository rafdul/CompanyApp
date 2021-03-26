const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Department.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getId = async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.postAll = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name: name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

// // w przypadku sukcesu w konsoli informacja o dokumencie przed zmianą
// exports.putId = async (req, res) => {
//   const { name } = req.body;
//   try {
//     await Department.findByIdAndUpdate({ _id: req.params.id }, { $set: { name: name }}, (err, info) => {
//       if(err) {
//         res.status(404).json({ message: 'Not found' });
//       } else {
//         res.json(info);
//       }
//     });
//   }
//   catch(err) {
//     res.status(500).json({ message: err });
//   }
// };

// // w przypadku sukcesu w konsoli informacja o dokumencie po zmianie
exports.putId = async (req, res) => {
  const { name } = req.body;
  try {
    const dep = await(Department.findById(req.params.id));
    if(dep) {
      await Department.updateOne({ _id: req.params.id }, { $set: { name: name }});
      const result = await(Department.findById(req.params.id));
      res.json({ message: 'OK', doc_updated: result });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteId = async(req, res) => {
  try {
    await Department.findByIdAndDelete({ _id: req.params.id }, (err,info) => {
      if(err) {
        res.status(404).json({ message: 'Not found' });
      } else {
        res.json({ message: 'OK', doc_deleted: info });
      }
    });
  }
  catch {
    res.status(500).json({ message: err });
  }
};