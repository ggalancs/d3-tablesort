/*
 * d3 table sort
 * (c) Ilkka Huotari 2013, http://ilkkah.com
 * Inspired by: http://devforrest.com/examples/table/table.php
 * License: MIT
 */

(function(globals) {

    var sort_column = -1,
        sort_order = 1;

    globals.TableSort = function(table, columns, data, dimensions) {

        dimensions = dimensions || { width: '500px', height: '300px' };

        var dim = {
                w: dimensions.width,
                h: dimensions.height,
                tablew: dimensions.width,
                divh: (parseFloat(dimensions.height) - 60) + "px",
                divw: (parseFloat(dimensions.width) + 20) + "px",
                cell_widths: []
            },
            outerTable,
            innerTable,
            tbody,
            rows;

        outerTable = ((typeof table === 'string')? d3.select(table): table).html(null).append("table").attr("style", "width:" + dim.w);

        function sort(d, tmp, i) {
            var sort,
                sort_btn = d3.select(d3.event.toElement),
                is_desc = sort_btn.classed('sort_desc');

            sort_order = sort_order * -1;
            sort_btn.classed('sort_desc', !is_desc).classed('sort_asc', is_desc);
            sort_column = i;
            tbody.selectAll("tr").sort(function(a, b) { return d.sort(a[sort_column], b[sort_column], sort_order); } );
        }

        outerTable
            .append("tr")
            .append("td")
            .append("table").attr("class", "header-table").attr("style", "width: " + dim.tablew)
            .append("tr").selectAll("th").data(columns).enter()
            .append("th")
            .text(function (column) { return column.text; })
            .selectAll('span')
            .data(function(d, i) { if (d.sort_column && sort_column === -1) { sort_column = i; } return d.sort? [d]: ''; }).enter()
            .append('span')
            .classed('sort_indicator sort_desc', true)
            .on('click', sort)

        innerTable = outerTable
    		.append("tr")
    		.append("td")
    		.append("div").attr("class", "scroll-table").attr("style", "width: " + dim.divw + "; height:" + dim.divh + ";")
    		.append("table").attr("class", "body-table").attr("style", "width:" + dim.tablew + "; height: " + dim.h + "; table-layout:fixed");

        tbody = innerTable.append("tbody");

        // Create a row for each object in the data and perform an intial sort.
        rows = tbody.selectAll("tr").data(data).enter().append("tr");

        // initial sort if wanted
        if (sort_column >= 0 && columns[sort_column].sort) {
            tbody.selectAll('tr').sort(function(a, b) { return columns[sort_column].sort(a[sort_column], b[sort_column], sort_order); })
        }

        // Create a cell in each row for each column
        rows.selectAll("td")
            .data(function (d) { return d; }).enter()
            .append("td")
    		.text(function (d) { return d; });

        // get cell widths
        d3.select(rows.node())
            .selectAll('td')
            .each(function(node, i) { dim.cell_widths.push(this.offsetablew); });

        // set cell widths to the header-table
        outerTable.selectAll('.header-table tr th')
            .data(dim.cell_widths)
            .style('width', function(d) { this.style.width = d + 'px'; return 1; })

    }

    globals.TableSort.alphabetic = function(a, b, sort_order) { return sort_order * a.localeCompare(b); }
    globals.TableSort.numeric = function(a, b, sort_order) { return sort_order * (parseFloat(b) - parseFloat(a)); }

}(window));