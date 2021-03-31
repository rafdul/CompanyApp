const Department = require('../department.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

after(() => {
  mongoose.models = {};
});

describe('Department', () => {

  it('should throw an error if no "name" arg', () => {
    const dep = new Department({}); // create new Department, but don't set `name` attr value

    dep.validate(err => {
        expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];
    for(let name of cases) {
      const dep = new Department({ name });
  
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if "name" is too long or too short', () => {
    const cases = ['lo', 'lore', 'lorem ipsum, lorem ips'];
    for(let name of cases) {
      const dep = new Department({ name });
  
      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw good', () => {
    const cases = ['lorem', 'lorem ipsum', 'lorem ipsum, lorem i'];
    for(let name of cases) {
      const dep = new Department({ name });
  
      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });


});