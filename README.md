# Wholly

jQuery plugin for triggering table column `mouseenter` and `mouseleave` events. Wholly is used for highlighting the entire table column. Wholly supports tables with `colspan` and `rowspan` attributes.

![Wholly highlighting](docs/static/image/wholly.gif)

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