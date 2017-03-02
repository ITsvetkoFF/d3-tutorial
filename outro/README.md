## SVG limitations (areas for inventions):
- There is no z-index (Google `amazon shares` and see how they are solving this problem)
- There is no position: absolute (you need transitions. Lots of them)
- You can not do drop shadow for a vertical line (but you can draw a line and a rectangle with gradient)
- You can not put text in a box (there is no box model, you need to render text, find its width and apply it to a rectangle - but do not forget that you have no z-index)
- You can use css, but style names are not the same
- etc

## How to learn D3.js
- https://github.com/vogievetsky/IntroD3
- Mike's bl.ocks: http://bl.ocks.org/mbostock
- Docs page on github.
- That's it. Examples and docs are better than books.

## Where to ask about D3.js
- Github issues (there are plenty of answered questions by Mike himself)
- StackOverflow (be aware of bad answers)
- Source code comments.

## What else can someone do with D3.js
- Quadtree https://bl.ocks.org/mbostock/4343214
- Voronoi diagram https://bl.ocks.org/mbostock/ec10387f24c1fad2acac3bc11eb218a5
- World tour https://bl.ocks.org/mbostock/4183330
- Mona Liza gistogram (OMG) https://bl.ocks.org/mbostock/0d20834e3d5a46138752f86b9b79727e
