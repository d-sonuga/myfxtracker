#include <myfxtracker/tests/baseunittest.mqh>
#include <myfxtracker/errors.mqh>

UnitTest *unittest = new UnitTest();

void testOnePlusOne(){
    unittest.addTest(__FUNCTION__);
    MQ4Errors errors;
    errors.getErrorMessage()
    unittest.assertEquals(__FUNCTION__, "1 + 1 should be equal to 2", 2, 1);
}

void runErrorTests(){
    testOnePlusOne();
}