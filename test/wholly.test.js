describe('Wholly', function() {
    jasmine.getFixtures().fixturesPath = './base';

    beforeEach(function () {
        loadFixtures('test/fixture/basic-table.html');
    });

    /*afterEach(function () {

    });*/

    it('throws an Error when applied to anything that is not table.', function () {
        expect(function () {
            $('body').wholly();
        }).toThrow(new Error('Wholly works only with tables.'));
    });

    //it('does not ');
    /*var myfunc = NS.myFunction;
 
    beforeEach(function(){
        spyOn(myfunc, 'init').andCallThrough();
    });
 
    afterEach(function() {
        myfunc.reset();
    });
 
    it("should be able to initialize", function() {
        expect(myfunc.init).toBeDefined();
        myfunc.init();
        expect(myfunc.init).toHaveBeenCalled();
    });
 
    it("should populate stuff during initialization", function(){
        myfunc.init();
        expect(myfunc.stuff.length).toEqual(1);
        expect(myfunc.stuff[0]).toEqual('Testing');
    });
    //will insert additional tests here later*/
});