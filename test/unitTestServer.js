var {validatePhoneNumber, validateMultipleNumbers} = require('../server.js');

describe('Server side test:', function() {

    it('singleValidationShouldReturnWrongTest', function(done) {
        //arrange
        var numbers = [
            '', null, undefined, '123',
            '263716791426', '6478342944', '22999393611',
            '_DELETED_1488176172', '39156553262_DELETED_1486721886'
        ];
        //act
        var validationResults = [];
        numbers.forEach((el)=>{
            validationResults.push(validatePhoneNumber(el));
        });
        //assert
        var areAllWrong = validationResults.every((el)=>{return el.result === "wrong"});
        if (areAllWrong) done();
        else done(new Error("Not all the test number phones are wrong"));
    });

    it('singleValidationCorrectedShouldStartWith27Test', function(done) {
        //arrange
        var numbers = ['785850248', '787612191'];
        //act
        var validationResults = [];
        numbers.forEach((el)=>{
            validationResults.push(validatePhoneNumber(el));
        });
        //assert
        var startAllWith27 = validationResults.every((el)=>{
            return el.correctedNumber.slice(0, 2) === '27';
        });
        if (startAllWith27) done();
        else done(new Error("Not all the tested number phones start with 27"));
    });

    it('singleValidationCorrectedMatchRegExTest', function(done) {
        //arrange
        var numbers = ['27831234567', '27827678672', '27720275376'];
        //act
        var validationResults = [];
        numbers.forEach((el)=>{
            validationResults.push(validatePhoneNumber(el));
        });
        //assert
        var regex = /^27[0-9]{9}$/;
        var matchAllRegex = validationResults.every((el)=>{
            return regex.test(el.number);
        });
        if (matchAllRegex) done();
        else done(new Error("Not all the tested number match the regex"));
    });

    it('multipleValidationFailTest', function(done) {
        //arrange
        var arrs = [
            []/*, null, undefined*/
        ];
        //act
        var validationResults = [];
        arrs.forEach((el)=>{
            validationResults.push(validateMultipleNumbers(el));
        });
        //assert
        var setAllError = validationResults.every((el)=>{
            return el.error = true;
        });
        if (setAllError) done();
        else done(new Error("Not all the tested value set error"));
    });

    it('multipleValidationSuccessTest', function(done) {
        //arrange
        var json = [
            {id: '103327417', sms_phone: '260955751013'},
            {id: '103286246', sms_phone: '787612191'},
            {id: '103307430', sms_phone: '761905189'},
            {id: '103425998', sms_phone: '27831234567'}
        ];
        //act
        var validationResults = validateMultipleNumbers(json);
        //assert
        var wellClassified =
        validationResults.correctNumbers.length === 1 &&
        validationResults.correctNumbers[0].number === '27831234567' &&
        validationResults.correctedNumbers.length === 2 &&
        validationResults.correctedNumbers[0].number === '787612191';
        validationResults.correctedNumbers[1].number === '761905189';
        validationResults.wrongNumbers.length === 1 &&
        validationResults.correctedNumbers[0].number === '260955751013';
        if (wellClassified) done();
        else done(new Error("Not all the tested elements are well classified"));
    });
  });