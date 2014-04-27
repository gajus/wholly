/**
 * jquery.wholly.js 0.1.2
 * https://github.com/gajus/wholly
 */
(function ($) {
    "use strict";

    var debug = false;

    $.fn.wholly = function () {
        var calcRowWidth,
            calcTableWidth,
            generateTableIndexTemplate,
            mapTableToIndex;
        
        /**
         * @param {Object} table jQuery selector referencing table.
         * @returns {Number} Maximum number of columns across all the table rows.
         */
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

        /**
         * @param {Object} row jQuery selector referencing table row.
         * @returns {Number} Number of cells in the row.
         */
        calcRowWidth = function (row) {
            var width = 0;

            row.find('td, th').each(function () {
                var colspan = parseInt($(this).attr('colspan'), 10) || 1;

                width += colspan;
            });

            return width;
        };

        /**
         * @param {Number} width Number of cells.
         * @param {Number} height Number of rows.
         * @returns {Array} Table representation in a matrix ignoring rowspan and colspan.
         */
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

        /**
         * @param {Object} table jQuery selector referencing table.
         * @param {Array} tableIndex Table matrix (index) produced using the generateTableIndexTemplate. This variable is changed by reference.
         */
        mapTableToIndex = function (table, tableIndex) {
            var rows = table.find('tr');

            // Iterate through each hypothetical table row.
            $.each(tableIndex, function (y) {
                var row = rows.eq(y),
                    rowChildren = row.children(),
                    cellIndex = 0;

                if (debug) {
                    console.groupCollapsed('Table row.', 'y:', y, 'rowChildren.length:', rowChildren.length);
                }

                // Iterate through each hypothetical table row column.
                // $.each will make a copy of the array before iterating. Must use live array reference.
                $.each(tableIndex[y], function (x) {
                    var cell = tableIndex[y][x],
                        colspan,
                        rowspan,
                        i,
                        j,
                        tempData;

                    // Table matrix is iterated left to right, top to bottom. It might be that cell has
                    // been assigned a value already because previous row-cell had "rowspan" property,
                    // possibly together with "colspan".
                    if (cell) {
                        if (debug) {
                            console.log('x:', cellIndex, 'cell:', cell[0]);
                        }
                    } else {
                        cell = rowChildren.eq(cellIndex++);

                        colspan = parseInt(cell.attr('colspan'), 10) || 1;
                        rowspan = parseInt(cell.attr('rowspan'), 10) || 1;

                        if (debug) {
                            if (colspan > 1 || rowspan > 1) {
                                console.group('x:', x, 'colspan:', colspan, 'rowspan:', rowspan, 'cell:', cell[0]);
                            } else {
                                console.log('x:', x, 'colspan:', colspan, 'rowspan:', rowspan, 'cell:', cell[0]);
                            }                            
                        }

                        for (i = 0; i < rowspan; i++) {
                            for (j = 0; j < colspan; j++) {
                                if (debug) {
                                    console.log('relative row:', i, 'relative cell:', j, 'absolute row:', y + i, 'absolute cell:', x + j);
                                }
                                
                                tableIndex[y + i][x + j] = cell;
                            }
                        }

                        if (colspan > 1 || rowspan > 1) {
                            console.groupEnd();
                        }
                    }

                    tempData = cell.data('wholly.index');

                    if (tempData === undefined) {
                        cell.data('wholly.index', x);
                    }
                });

                if (debug) {
                    console.groupEnd();
                }
            });
        };

        return this.each(function () {
            var table = $(this),
                tableWidth = calcTableWidth(table),
                tableHeight = table.find('tr').length,
                tableIndex = generateTableIndexTemplate(tableWidth, tableHeight),
                column;

            if (debug) {
                console.log('tableWidth:', tableWidth, 'tableHeight:', tableHeight);
            }

            mapTableToIndex(table, tableIndex);
            
            table.on('mouseenter', 'td, th', function () {
                var colspan = parseInt($(this).attr('colspan'), 10) || 1,
                    cellRealIndex = $(this).data('wholly.index'),
                    highlightCellFrom,
                    highlightCellTo;

                column = $(this);

                highlightCellFrom = cellRealIndex;
                highlightCellTo = cellRealIndex + colspan;

                $.each(tableIndex, function (n, rowIndex) {
                    $.each(rowIndex.slice(highlightCellFrom, highlightCellTo), function (n, cell) {
                        column = column.add(cell);
                    });                    
                });

                column.trigger('wholly.mouseenter');
            });

            table.on('mouseleave', 'td, th', function () {
                column.trigger('wholly.mouseleave');
            });
        });
    };
}(jQuery));