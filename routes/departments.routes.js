const express = require('express');
const router = express.Router();
const DepartmentsController = require('../controllers/departments.controller');

router.get('/departments', DepartmentsController.getAll);

router.get('/departments/random', DepartmentsController.getRandom);

router.get('/departments/:id', DepartmentsController.getId);

router.post('/departments', DepartmentsController.postAll);

router.put('/departments/:id', DepartmentsController.putId);

router.delete('/departments/:id', DepartmentsController.deleteId);

module.exports = router;
