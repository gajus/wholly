# Wholly

jQuery plugin for triggering table column `mouseenter` and `mouseleave` events. Wholly is used for highlighting the entire table column or row. Wholly supports layouts that utilize with `colspan` and `rowspan`.

[Interactive demo](http://gajus.com/wholly/demo/).

## How does it work?

If you want to support `colspan` and `rowspan`, then first you need to build table cell index, ie. matrix that identifies cell positition in every row regardless of the markup. Then you need to track events of all the table cells of interest and calculate their offset in the matrix and the columns that share the vertical index.

The resulting lookup is illustrated in the following animation:

![Wholly highlighting a matrix](docs/static/image/animation.gif)

## Why not CSS?

There are at least few ways to achive column highlighting using just CSS or with little JavaScript, e.g.

* http://stackoverflow.com/a/11175979/368691, CSS only solution using pseudo elements.
* http://www.cssnewbie.com/simple-table-column-highlighting/#.U1Ywa1GSwe4, JavaScript together with [HTML table column element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col).

Neither of the above solutions support `rowspan` or `colspan`. In essence, neither of the above will work if you have header groups, mergend columns, a summarising table footer, or similar table layout variation. Wholly supports `colspan` and `rowspan` anywhere in `<table>` and covers all of the mentioned cases.

## Use case

Most often you'd use Wholly to highlight the entire column of the selected cell.

![Table using Wholly](docs/static/image/example-use-case.png)

However, Wholly is not limited to setting a particular style. The custom event hook allows you to select the entire column and can be used to copy the data, for selecting multiple columns, etc.

## Usage

Instantiating wholly will add two new events `wholly.mouseenter` and `wholly.mouseleave` that you can use to customise table behaviour. In the below example, Wholly is used for highlighting the entire table column.

There are no additional settings.

```js
$(function () {
    var table = $('table');

    table.wholly();

    table.on('wholly.mouseenter', 'td, th', function () {
        $(this).addClass('wholly-highlight');
    });

    table.on('wholly.mouseleave', 'td, th', function () {
        $(this).removeClass('wholly-highlight');
    });
});
```

 //Table representation in a matrix ignoring rowspan and colspan.

    /**
     * Generates a table with a number of rows and cells equal to the subject table.
     * The generated table rowspan and colspan of the subject table are extended
     * into separate rows and columns.

Minor optimization.
Improved documentation.
Added test cases.
Using grunt to minify the JS.
improved naming convention


* ability to .remove() wholly.