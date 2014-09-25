describe('A basic table with the first cell in mouseenter state', function () {
    var table,
        events;

    beforeEach(function () {
        $('body').html($.parseHTML(__html__['test/fixture/basic.html']));

        table = $('table');

        table.wholly({
            highlightHorizontal: 'horizontal',
            highlightVertical: 'vertical'
        });

        events = {
            mouseenter: {
                table: {
                    horizontal: [],
                    vertical: []
                },
                cell: {
                    horizontal: [],
                    vertical: []
                }
            },
            mouseleave: {
                table: {
                    horizontal: [],
                    vertical: []
                },
                cell: {
                    horizontal: [],
                    vertical: []
                }
            }
        };

        table.on('wholly.mouseenter', function (e, affectedAxes) {
            $.each(affectedAxes.horizontal, function () {
                events.mouseenter.table.horizontal.push(parseInt($(this).text(), 10));
            });

            $.each(affectedAxes.vertical, function () {
                events.mouseenter.table.vertical.push(parseInt($(this).text(), 10));
            });
        });

        table.on('wholly.mouseleave', function (e, affectedAxes) {
            $.each(affectedAxes.horizontal, function () {
                events.mouseleave.table.horizontal.push(parseInt($(this).text(), 10));
            });

            $.each(affectedAxes.vertical, function () {
                events.mouseleave.table.vertical.push(parseInt($(this).text(), 10));
            });
        });

        table.on('wholly.mouseenter-horizontal', function (e) {
            events.mouseenter.cell.horizontal.push(parseInt($(e.target).text(), 10));
        });

        table.on('wholly.mouseenter-vertical', function (e) {
            events.mouseenter.cell.vertical.push(parseInt($(e.target).text(), 10));
        });

        table.on('wholly.mouseleave-horizontal', function (e) {
            events.mouseleave.cell.horizontal.push(parseInt($(e.target).text(), 10));
        });

        table.on('wholly.mouseleave-vertical', function (e) {
            events.mouseleave.cell.vertical.push(parseInt($(e.target).text(), 10));
        });

        table.find('tr').eq(0).find('th').eq(0).trigger('mouseenter');
    });

    it('must trigger table event wholly.mouseenter for the entire row', function () {
        expect(events.mouseenter.table.horizontal).toEqual([1,2,3,4,5]);
    });

    it('must trigger table event wholly.mouseenter for the entire column', function () {
        expect(events.mouseenter.table.vertical).toEqual([1,6,11,16,21,26]);
    });

    it('must trigger table cell event wholly.mouseenter-horizontal for each cell in the entire row', function () {
        expect(events.mouseenter.cell.horizontal).toEqual([1,2,3,4,5]);
    });

    it('must trigger table cell event wholly.mouseenter-vertical for each cell in the entire row', function () {
        expect(events.mouseenter.cell.vertical).toEqual([1,6,11,16,21,26]);
    });

    describe('following the mouseleave state', function () {
        beforeEach(function () {
            table.find('tr').eq(0).find('th').eq(0).trigger('mouseleave');
        });

        it('must trigger table event wholly.mouseleave for the entire row', function () {
            expect(events.mouseleave.table.horizontal).toEqual([1,2,3,4,5]);
        });

        it('must trigger table event wholly.mouseleave for the entire column', function () {
            expect(events.mouseleave.table.vertical).toEqual([1,6,11,16,21,26]);
        });

        it('must trigger table cell event wholly.mouseleave-horizontal for each cell in the entire row', function () {
            expect(events.mouseleave.cell.horizontal).toEqual([1,2,3,4,5]);
        });

        it('must trigger table cell event wholly.mouseleave-vertical for each cell in the entire row', function () {
            expect(events.mouseleave.cell.vertical).toEqual([1,6,11,16,21,26]);
        });
    });

    describe('with the highlightHorizontal option', function () {
        it('must add the highlightHorizontal class to each cell in the entire row', function () {
            expect($.map(table.find('.horizontal'), function (e) { return parseInt($(e).text(), 10); })).toEqual([1,2,3,4,5]);
        });

        describe('following the mouseleave state', function () {
            beforeEach(function () {
                table.find('tr').eq(0).find('th').eq(0).trigger('mouseleave');
            });

            it('must remove the highlightHorizontal class from each cell in the entire row', function () {
                expect(table.find('tr').eq(0).children().filter(function () { return !$(this).hasClass('horizontal'); }).length).toEqual(5);
            });
        });
    });

    describe('with the highlightVertical option', function () {
        it('must add the highlightVertical class to each cell in the entire row', function () {
            expect($.map(table.find('.vertical'), function (e) { return parseInt($(e).text(), 10); })).toEqual([1,6,11,16,21,26]);
        });

        describe('following the mouseleave state', function () {
            beforeEach(function () {
                table.find('tr').eq(0).find('th').eq(0).trigger('mouseleave');
            });

            it('must remove the highlightVertical class from each cell in the entire row', function () {
                expect(table.find('tr').eq(0).children().filter(function () { return !$(this).hasClass('vertical'); }).length).toEqual(5);
            });
        });
    });
});