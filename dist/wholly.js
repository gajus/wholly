/**
* @version 2.0.0
* @link https://github.com/gajus/wholly for the canonical source repository
* @license https://github.com/gajus/wholly/blob/master/LICENSE BSD 3-Clause
*/
'use strict';

/* global jQuery */

/**
 * @link https://github.com/gajus/wholly for the canonical source repository
 * @license https://github.com/gajus/wholly/blob/master/LICENSE BSD 3-Clause
 */
(function ($) {
    var
        /**
         * Enables console logging.
         */
        debug = false,
        /**
         * Index of tables that are using Wholly.
         * Used to make sure that same table is not using Wholly twice.
         */
        globalTableIndex = [],
        wholly = {},
        defaultOptions;

    defaultOptions = {
        highlightHorizontal: null,
        highlightVertical: null
    };

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
     * Matrix is a representation of the subject table, where table cells either
     * with rowspan or colspan are broken apiece. In the matrix, multiple cells
     * can refer to a single cell, row, rowspan or colspan in the subject table.
     *
     * @param {Object} row jQuery selector referencing a table row.
     * @returns {Array}
     */
    wholly.generateTableMatrix = function (table) {
        var width = wholly.calcTableMaxCellLength(table),
            height = table.find('tr').length;

        if (debug) {
            console.log('generateTableMatrix', 'width:', width, 'height:', height);
        }

        return wholly.generateMatrix(width, height);
    };

    /**
     * @see http://stackoverflow.com/questions/8301400/how-do-you-easily-create-empty-matrices-javascript
     * @param {Number} width
     * @param {Number} height
     * @returns {Array}
     */
    wholly.generateMatrix = function (width, height) {
        var matrix = [];

        while (height--) {
            matrix.push(new Array(width));
        }

        return matrix;
    };

    /**
     * @param {Object} table jQuery selector referencing a table.
     * @return {Object}
     */
    wholly.indexTable = function (table) {
        var tableIndex = wholly.generateTableMatrix(table),
            rows = table.find('tr');

        // Iterate through each hypothetical table row.
        $.each(tableIndex, function (y) {
            var row = rows.eq(y),
                // Note that columns.length <= table width
                columns = row.children(),
                cellIndex = 0;

            if (debug) {
                console.groupCollapsed('Table row.', 'y:', y, 'columns.length:', columns.length);
            }

            // Iterate through each hypothetical table row column.
            // $.each will make a copy of the array before iterating. Must use live array reference.
            $.each(tableIndex[y], function (x) {
                var cell = tableIndex[y][x],
                    colspan,
                    rowspan,
                    i,
                    j;

                // Table matrix is iterated left to right, top to bottom. It might be that cell has
                // been assigned a value already because previous row-cell had a "rowspan" property,
                // possibly together with "colspan".
                if (cell) {
                    if (debug) {
                        console.log('x:', cellIndex, 'cell:', cell[0], 'state: already indexed');
                    }
                } else {
                    cell = columns.eq(cellIndex++);

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

                            tableIndex[y + i][x + j] = cell[0];
                        }
                    }

                    if (colspan > 1 || rowspan > 1) {
                        console.groupEnd();
                    }
                }

                if (cell.data && cell.data('wholly.offsetInMatrix') === undefined) {
                    cell.data('wholly.offsetInMatrix', [x, y]);
                }
            });

            if (debug) {
                console.groupEnd();
            }
        });

        return tableIndex;
    };

    $.fn.wholly = function (_options) {
        this.each(function () {
            var table,
                tableIndex,
                horizontal,
                vertical,
                mouseleave,
                options = $.extend({}, defaultOptions, _options);

            if ($.inArray(this, globalTableIndex) !== -1) {
                if (debug) {
                    console.warn('Wholly has been applied twice on the same table.');
                }

                return;
            }

            globalTableIndex.push(this);

            table = $(this);

            if (!table.is('table')) {
                throw new Error('Wholly works only with tables.');
            }

            tableIndex = wholly.indexTable(table);

            table.on('mouseenter', 'td, th', function () {
                var target = $(this),
                    rowspan = parseInt(target.attr('rowspan'), 10) || 1,
                    colspan = parseInt(target.attr('colspan'), 10) || 1,
                    offsetInMatrix = target.data('wholly.offsetInMatrix');

                // Avoid multiple selections when the columns are selected programmatically.
                mouseleave();

                horizontal = $([]);
                vertical = $([]);

                $.each(tableIndex.slice(offsetInMatrix[1], offsetInMatrix[1] + rowspan), function (n, cell) {
                    horizontal = horizontal.add(cell);
                });

                $.each(tableIndex, function (n, rowIndex) {
                    vertical = vertical.add(rowIndex.slice(offsetInMatrix[0], offsetInMatrix[0] + colspan));
                });

                if (debug) {
                    console.log('mouseenter', 'horizontal:', horizontal.length, 'vertical:', vertical.length);
                }

                horizontal.trigger('wholly.mouseenter-horizontal');
                vertical.trigger('wholly.mouseenter-vertical');

                if (options.highlightHorizontal) {
                    horizontal.addClass(options.highlightHorizontal);
                }

                if (options.highlightVertical) {
                    vertical.addClass(options.highlightVertical);
                }

                table.trigger('wholly.mouseenter', {
                    horizontal: horizontal,
                    vertical: vertical
                });
            });

            mouseleave = function () {
                if (!horizontal && !vertical) {
                    return;
                }

                horizontal.trigger('wholly.mouseleave-horizontal');
                vertical.trigger('wholly.mouseleave-vertical');

                if (options.highlightHorizontal) {
                    horizontal.removeClass(options.highlightHorizontal);
                }

                if (options.highlightVertical) {
                    vertical.removeClass(options.highlightVertical);
                }

                table.trigger('wholly.mouseleave', {
                    horizontal: horizontal,
                    vertical: vertical
                });

                horizontal = vertical = undefined;
            };

            table.on('mouseleave', 'td, th', mouseleave);
        });
    };
}(jQuery));
