import "./styles.css";
import * as d3 from "d3";

const width = 250;
const height = 250;
const padding = 10; // min: 1

const createNode = level => {
  const numChildren = Math.ceil(Math.random() * 3) + 1;

  if (level > 2 && (level >= 5 || numChildren <= 1)) {
    return { value: Math.random() + 1 / level };
  }
  const children = [];
  for (let i = 0; i < numChildren; i++) {
    children.push(createNode(level + 1));
  }
  return { children };
};

const data = createNode(1);

const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
const pack = data =>
  d3
    .pack()
    .size([width, height])
    .padding(3)(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  );

const svg = d3
  .select("#data")
  .append("svg")
  .attr("viewBox", [
    -padding,
    -padding,
    width + padding * 2,
    height + padding * 2
  ]);
const root = pack(data);

const node = svg
  .selectAll("g")
  .data(
    d3
      .nest()
      .key(d => d.height)
      .entries(root.descendants())
  )
  .join("g")
  .selectAll("g")
  .data(d => d.values)
  .join("g")
  .attr("transform", d => `translate(${d.x},${d.y})`);

const circle = node
  .append("circle")
  .attr("r", d => d.r)
  .attr("stroke-width", d => 1 / (d.depth + 1))
  .attr("fill", d => color(d.height));

circle.on("click", d => {
  svg
    .transition()
    .duration(1000)
    .attr("viewBox", [
      d.x - d.r - padding,
      d.y - d.r - padding,
      d.r * 2 + padding * 2,
      d.r * 2 + padding * 2
    ]);
});
