/**
 * @version 2.0.0
 * @link https://github.com/gajus/wholly for the canonical source repository
 * @license https://github.com/gajus/wholly/blob/master/LICENSE BSD 3-Clause
 */
(function ($) {
    'use strict';

    var /**
         * Enables console logging.
         */
        debug = false,
        /**
         * Index of tables that are using Wholly.
         * Used to make sure that same table is not using Wholly twice.
         */
        globalTableIndex = [],
        wholly = {};
    
    /**
     * @param {Object} table jQuery selector referencing a table.
     * @returns {Number} Maximum number of cells across all the table rows.
     */
    wholly.calcTableMaxCellLength = function (table) {
        var maxWidth = 0;

        table.find('tr').each(function () {
            var rowWidth = wholly.calcRowCellLength($(this));

            if (rowWidth > maxWidth) {
                maxWidth = rowWidth;
            }
        });

        return maxWidth;
    };

    /**
     * @param {Object} row jQuery selector referencing a table row.
     * @returns {Number} Number of cells in the row.
     */
    wholly.calcRowCellLength = function (row) {
        var width = 0;

        row.find('td, th').each(function () {
            var colspan = parseInt($(this).attr('colspan'), 10) || 1;

            width += colspan;
        });

        return width;
    };

    /**
     * Table index is a representation of the subject table, where the rowspan and colspan
     * properties of the subject table are expanded. As a result, multiple index positions
     * can refer to a single cell, row, rowspan or colspan in the subject table.
     * 
     * @param {Number} width Number of cells.
     * @param {Number} height Number of rows.
     * @returns {Array} Table representation in an array matrix.
     */
    wholly.generateTableIndexTemplate = function (width, height) {
        var tableIndex = [];

        while (height--) {
            tableIndex.push(new Array(width));
        }

        if (debug) {
            console.log('generateTableIndexTemplate', 'tableWidth:', tableWidth, 'tableHeight:', tableHeight);
        }

        return tableIndex;
    };

    /**
     * 
     * 
     * @param {Object} table jQuery selector referencing a table.
     * @param {Array} tableIndex Table matrix (index) produced using the wholly.generateTableIndexTemplate. This variable is changed by reference.
     */
    wholly.indexTable = function (table, tableIndex) {
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

    $.fn.wholly = function () {
        this.each(function () {
            var table,
                tableWidth,
                tableHeight,
                tableIndex,
                column;

            if ($.inArray(this, globalTableIndex) != -1) {
                return;
            }

            globalTableIndex.push(this);

            table = $(this);

            if (!table.is('table')) {
                throw new Error('Wholly works only with tables.');
            }

            table.trigger('wholly');

            tableWidth = wholly.calcTableMaxCellLength(table);
            tableHeight = table.find('tr').length;
            tableIndex = wholly.generateTableIndexTemplate(tableWidth, tableHeight);

            wholly.indexTable(table, tableIndex);
            
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