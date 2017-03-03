interface TsvData {
    name: string;
    value: number;
}

let margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.1);

let y = d3.scaleLinear()
    .range([height, 0]);

let xAxis = d3.axisBottom(x);

let yAxis = d3.axisLeft(y);

let chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, (error, data: d3.DSVParsedArray<TsvData>) => {
    x.domain(data.map((d: TsvData) => d.name));
    y.domain([0, d3.max(data, (d: TsvData) => d.value)]);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart.selectAll(".bar")
        .data(data).enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .attr("width", x.bandwidth());
});

function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}