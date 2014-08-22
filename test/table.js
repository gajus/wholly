describe('a', function() {
    it('b', function () {
        $('body').html($.parseHTML(__html__['test/fixture/basic-table.html']));

        $('table').wholly();

        console.log($('table').length);
    });
});