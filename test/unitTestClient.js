let chai = require('chai');
let chaiHttp = require('chai-http');
var {validatePhoneNumber, validateMultipleNumbers, app} = require('../server.js');
let should = chai.should();

describe('Client side test:', function() {
    it('CSVValidationEndPointReachableTest', function(done) {
        //arrange
        var url = '/validateFromCSV';
        //act
        chai.request(app)
        .get(url)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
          done();
        });
    });

    it('singleValidationEndpointReachableTest', function(done) {
        //arrange
        var url = '/validatenumber';
        //act
        chai.request(app)
        .get(url)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
          done();
        });
    });
});