/// <reference types='../node_modules/@types/d3' />

let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g");

let alphabetInput = d3.select("#alphabet");
let posRange = d3.select("#nPos");

// when the input range changes update the circle
posRange.on("input", function() {
    updatePosition(+(<HTMLInputElement>this).value);
});

// Initial starting radius of the circle
updatePosition(50);

// update the elements
function updatePosition(nPos) {

    // adjust the text on the range slider
    d3.select("#nPos-value").text(nPos);
    posRange.property("value", nPos);

    // update the circle radius
    g.attr("transform", `translate(32,${nPos})`);
}

function update(data) {

    let t = (<any>d3).transition().duration(750); //??

    // JOIN new data with old elements.
    let text = g.selectAll("text")
        .data(data, (d: string) => d );

    // EXIT old elements not present in new data.
    text.exit()
        .attr("class", "exit")
        .transition(t)
        .attr("y", 60)
        .style("fill-opacity", 1e-6)
        .remove();

    // UPDATE old elements present in new data.
    text.attr("class", "update")
        .attr("y", 0)
        .style("fill-opacity", 1)
        .transition(t)
        .attr("x", function(d, i) { return i * 32; });

    // ENTER new elements present in new data.
    text.enter().append("text")
        .attr("class", "enter")
        .attr("dy", ".35em")
        .attr("y", -60)
        .attr("x", function(d, i) { return i * 32; })
        .style("fill-opacity", 1e-6)
        .text(function(d) { return d; })
        .transition(t)
        .attr("y", 0)
        .style("fill-opacity", 1);
}

// The initial display.
update(alphabet);

function onAlphabetChanged(data?: string[]) {
    if (!data) {
        data = d3.shuffle(alphabet)
            .slice(0, Math.floor(Math.random() * 26))
            .sort();
        alphabetInput.attr("value", data.join(""));
    }
    update(data);
}

// Grab a random sample of letters from the alphabet, in alphabetical order.
let interval = d3.interval(() => onAlphabetChanged(), 1500);

alphabetInput.on("input", function () {
    onAlphabetChanged((<HTMLInputElement>this).value.split(""));
    interval.stop();
});