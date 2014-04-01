(function () {
    $.fn.wholly = function () {
        var getColumnProperties;

        getColumnProperties = function (cell) {
            return {
                index: cell.index(),
                colspan: parseInt(cell.attr('colspan'), 10) || 1,
                rowspan: parseInt(cell.attr('rowspan'), 10) || 1
            };
        };

        return this.each(function () {
            var table = $(this),
                lastColumn;

            table.on('mouseenter', 'td, th', function () {
                var activeCell = getColumnProperties($(this)),
                    column = $(this);

                table.find('tr').each(function () {
                    var cell = $(this).children().eq(activeCell.index);

                    column = column.add(cell);
                });

                column.addClass('wholly');

                lastColumn = column;
            });

            table.on('mouseleave', 'td, th', function () {
                lastColumn.removeClass('wholly');
            });
        });
    };
}());