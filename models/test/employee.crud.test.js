const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const ObjectId = require('mongodb').ObjectId;

describe('Employee', () => {

  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.log(err);
    }
  });

  after(() => {
    mongoose.models = {};
  });

  describe('Reading data', () => {

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'Józef', lastName: 'Kukułka', department: 'Ciepłownia' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Zięba', department: 'Wodociągi' });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Helena' });
      const expectedFirstName = 'Helena';
      expect(employee.firstName).to.be.equal(expectedFirstName);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Reading with "populate"', () => {

    it('should return all the data with "find" method with "populate"', async () => {
      const testDepOne = new Department({ _id: ObjectId('111111111111aaaaaaaaaaaa'), name: 'Marketing' });
      await testDepOne.save();
      const testDepTwo = new Department({ _id: ObjectId('222222222222bbbbbbbbbbbb'), name: 'Księgowość' });
      await testDepTwo.save();
      const testEmpOne = new Employee({ firstName: 'Józef', lastName: 'Kukułka', department: '111111111111aaaaaaaaaaaa' });
      await testEmpOne.save();
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Zięba', department: '222222222222bbbbbbbbbbbb' });
      await testEmpTwo.save();

      const employees = await Employee.find().populate('department');
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
      expect(employees[1].department.name).to.be.equal('Księgowość');
    });

    after(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Lorem', lastName: 'Ipsum', department: 'Dolores' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Józef', lastName: 'Kukułka', department: 'Ciepłownia' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Zięba', department: 'Wodociągi' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({firstName: 'Józef'}, { $set: {firstName: '##Józef##'}});
      const employee = await Employee.findOne({firstName: '##Józef##'}); 
      expect(employee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({firstName: 'Józef'}); 
      employee.firstName = '##Józef##'
      await employee.save();
      const updatedEmployee = await Employee.findOne({firstName: '##Józef##'});
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({ $set: {department: 'Updated'}});
      const employees = await Employee.find({ department: 'Updated' }); 
      expect(employees).to.not.be.null;
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Józef', lastName: 'Kukułka', department: 'Ciepłownia' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Helena', lastName: 'Zięba', department: 'Wodociągi' });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Józef' });
      const deletedEmployee = await Employee.findOne({ firstName: 'Józef' });
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({firstName: 'Józef'}); 
      await employee.remove();
      const deletedEmployee = await Employee.findOne({firstName: 'Józef'});
      expect(deletedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const deletedEmployees = await Employee.find();
      expect(deletedEmployees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });
});