(function () {
    $.fn.wholly = function () {
        var calcRowWidth,
            calcTableWidth,
            generateTableIndexTemplate;
            
        calcTableWidth = function (table) {
            var maxWidth = 0;

            table.find('tr').each(function () {
                var rowWidth = calcRowWidth($(this));

                if (rowWidth > maxWidth) {
                    maxWidth = rowWidth;
                }
            });

            return maxWidth;
        };

        calcRowWidth = function (row) {
            var width = 0;

            row.find('td, th').each(function () {
                var colspan = parseInt($(this).attr('colspan'), 10) || 1;

                width += colspan;
            });

            return width;
        };

        generateTableIndexTemplate = function (width, height) {
            var tableIndex = [],
                rowWidth,
                rowIndex;

            while (height--) {
                rowWidth = width;
                rowIndex = [];

                while (rowWidth--) {
                    rowIndex.push(null);
                }

                tableIndex.push(rowIndex);
            }

            return tableIndex;
        };

        return this.each(function () {
            var table = $(this),
                tableWidth = calcTableWidth(table),
                tableHeight = table.find('tr').length,
                tableIndex = generateTableIndexTemplate(tableWidth, tableHeight),
                lastColumn;

            //console.log( tableIndex, tableIndex.length );
            //console.log('tableWidth:', tableWidth, 'tableHeight:', tableHeight);

            $.each(tableIndex, function (y) {
                var row = table.find('tr').eq(y),
                    rowChildren = row.children(),
                    cellIndex = 0;

                //console.log('row.length:', row.length, 'y:', y);

                // Becareful. $.each will make a copy of the array before iterating. Must use live array reference.
                $.each(tableIndex[y], function (x) {
                    var cell = tableIndex[y][x],
                        colspan,
                        rowspan,
                        i,
                        j;

                    if (!cell) {
                        cell = rowChildren.eq(cellIndex++);

                        //console.log('x:', cellIndex, 'cell:', cell.length);

                        colspan = parseInt(cell.attr('colspan'), 10) || 1;
                        rowspan = parseInt(cell.attr('rowspan'), 10) || 1;

                        //console.log('rowChildren:', rowChildren.length, 'x:', x, 'colspan:', colspan, 'rowspan:', rowspan);

                        for (i = 0; i < rowspan; i++) {
                            for (j = 0; j < colspan; j++) {
                                //console.log('i:', i, 'j:', j, 'yi:', y + i, 'xj:', x + j);
                                
                                tableIndex[y + i][x + j] = cell;
                            }
                        }
                    }
                });
            });
            
            table.on('mouseenter', 'td, th', function () {
                var cellRealIndex = 0,
                    colspan = parseInt($(this).attr('colspan'), 10) || 1,
                    highlightCellFrom,
                    highlightCellTo;

                lastColumn = $(this);

                $(this).prevAll().each(function () {
                    var colspan = parseInt($(this).attr('colspan'), 10) || 1;

                    cellRealIndex += colspan;
                });

                highlightCellFrom = cellRealIndex;
                highlightCellTo = cellRealIndex + colspan;

                $.each(tableIndex, function (n, rowIndex) {
                    $.each(rowIndex.slice(highlightCellFrom, highlightCellTo), function (n, cell) {
                        lastColumn = lastColumn.add(cell);
                    });                    
                });

                lastColumn.addClass('wholly');
            });

            table.on('mouseleave', 'td, th', function () {
                lastColumn.removeClass('wholly');
            });
        });
    };
}());