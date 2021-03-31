const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

after(() => {
  mongoose.models = {};
});

describe('Employee', () => {

  it('should throw an error if no arguments', () => {
    const emp = new Employee({});

    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if there aren`t all arguments', () => {
    const emp1 = new Employee({firstName: 'Józef', lastName: 'Kukułka'});
    const emp2 = new Employee({firstName: 'Józef', department: 'Ciepłownia'});
    const emp3 = new Employee({lastName: 'Kukułka', department: 'Ciepłownia'});
    const emp4 = new Employee({lastName: 'Kukułka'});
    const emp5 = new Employee({firstName: 'Józef'});
    const emp6 = new Employee({department: 'Ciepłownia'});

    const cases = [emp1, emp2, emp3, emp4, emp5, emp6];
    for(let variant of cases) {
      const emp = new Employee({variant});
  
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw an error if arguments are not a string', () => {
    const cases = [
      {firstName: {}, lastName: {}, department: {}},
      {firstName: [], lastName: [], department: []},
    ];
    for(let variant of cases) {
      const emp = new Employee({variant});
  
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should throw good if all arguments are correct', () => {
    const cases = [
      {firstName: 'Józef', lastName: 'Kukułka',department: 'Ciepłownia'},
      {firstName: 'xyz', lastName: 'abc',department: '123dey'},
    ];
    for(let variant of cases) {
      const emp = new Employee({variant});
  
      emp.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });
});

