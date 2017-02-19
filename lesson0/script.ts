/// <reference types='../node_modules/@types/d3' />

let body = d3.select("body");
let model = body.append("input").attr("type", "text");
let table = body.append("table");
let tableRow = table.append("tr");
d3.range(9).forEach(() => table.append("tr"));

let dsv =  d3.dsvFormat(",");

model.on("input", function() {
    let text = (<HTMLInputElement>this).value;
    // let numericArray = text.split("");
    let numericArray = dsv.parseRows(text)[0];
    drawTable(numericArray);
});

function drawTable(data) {
    let columns = tableRow
        .selectAll("td")
        .data(data, (d: string) => d );

    columns.exit().remove();

    let cell = columns.enter()
        .append("td")
        .attr("valign", "top");
    cell.append("input");
    cell.append("span");

    let mergedCell = cell.merge(columns)
        .attr("rowspan", (d) => +d+1)
        .select("span")
        .text((d: string) => d);

}
