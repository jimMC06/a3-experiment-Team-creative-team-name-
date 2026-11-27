import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const WIDTH = 720;
const HEIGHT = 450;
const MARGIN = { top: 35, right: 35, bottom: 55, left: 55 };

function createSvg(container, title) {
    container.replaceChildren();

    const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
        .attr("role", "img")
        .attr("aria-label", title)
        .style("width", "100%")
        .style("max-width", `${WIDTH}px`)
        .style("height", "auto");

    svg.append("text")
        .attr("x", WIDTH / 2)
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("fill", "black")
        .text(title);

    return svg;
}

function addMark(svg, x, y, width, height) {
    // Identical dashed outlines mark the selected values without color cues
    svg.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-dasharray", "5,3")
        .attr("pointer-events", "none");
}

export function drawBarChart(container, trial) {
    const svg = createSvg(container, "Bar chart");
    const innerW = WIDTH - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const x = d3.scaleBand()
        .domain(d3.range(trial.values.length))
        .range([MARGIN.left, MARGIN.left + innerW])
        .padding(0.25);
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([MARGIN.top + innerH, MARGIN.top]);

    svg.append("g")
        .attr("transform", `translate(0,${MARGIN.top + innerH})`)
        .call(d3.axisBottom(x).tickFormat(() => ""));
    svg.append("g")
        .attr("transform", `translate(${MARGIN.left},0)`)
        .call(d3.axisLeft(y).tickValues([]));

    svg.selectAll(".bar")
        .data(trial.values)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", value => y(value))
        .attr("width", x.bandwidth())
        .attr("height", value => y(0) - y(value))
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

    //highlight the marked indices
    for (const index of trial.markedIndices) { //dotted outline
        const value = trial.values[index];
        addMark(svg, x(index) - 3, y(value) - 3,
            x.bandwidth() + 6, y(0) - y(value) + 6);

        svg.append("circle")
            .attr("cx", x(index) + x.bandwidth() / 2)
            .attr("cy", (y(value) + y(0)) / 2)
            .attr("r", 2)
            .attr("fill", "black")
            .attr("pointer-events", "none");
    }
}

export function drawPieChart(container, trial) {
    const svg = createSvg(container, "Pie chart");
    const radius = Math.min(WIDTH, HEIGHT) * 0.36;
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2 + 10;
    // Calculate pie slices from trial values
    const pie = d3.pie()
        .sort(null)
        .padAngle(0.015)
        .value(value => value)(trial.values);
    // Use same arc shape for slices and highlights
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const chart = svg.append("g")
        .attr("transform", `translate(${centerX},${centerY})`);

    // Draw all pie slices
    chart.selectAll("path.slice")
        .data(pie)
        .join("path")
        .attr("class", "slice")
        .attr("d", arc)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);


        
    // Highlight the two marked slices with a dot and a outline
    const dotArc = d3.arc() //how far from the edge the dot will be (65%)
        .innerRadius(radius * 0.65)
        .outerRadius(radius * 0.65);

    for (const index of trial.markedIndices) { 
        chart.append("path") //dotted outline
            .datum(pie[index])
            .attr("d", arc)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray", "5,3")
            .attr("pointer-events", "none");

        const [x, y] = dotArc.centroid(pie[index]); 

        chart.append("circle") //center dot
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 2)
            .attr("fill", "black")
            .attr("pointer-events", "none");
        }

}


export function drawStackedBarChart(container, trial) {
    const svg = createSvg(container, "Stacked bar chart");
    const total = d3.sum(trial.values);
    const barWidth = 150;
    const barX = (WIDTH - barWidth) / 2;
    const barTop = MARGIN.top + 15;
    const barHeight = HEIGHT - MARGIN.top - MARGIN.bottom - 20;
    // one single stacked bar contains each randomly generated value as a segment
    const y = d3.scaleLinear()
        .domain([0, total])
        .range([barTop + barHeight, barTop]);

    let cumulative = 0;
    const segments = trial.values.map((value, index) => {
        const segment = {
            index,
            value,
            start: cumulative,
            end: cumulative + value
        };
        cumulative += value;
        return segment;
    });

    svg.append("rect")
        .attr("x", barX)
        .attr("y", barTop)
        .attr("width", barWidth)
        .attr("height", barHeight)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    svg.selectAll("rect.segment")
        .data(segments)
        .join("rect")
        .attr("class", "segment")
        .attr("x", barX)
        .attr("width", barWidth)
        .attr("y", segment => y(segment.end))
        .attr("height", segment => y(segment.start) - y(segment.end))
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5);

    for (const index of trial.markedIndices) {
        const segment = segments[index];
        addMark(svg, barX - 4, y(segment.end) - 2,
            barWidth + 8, y(segment.start) - y(segment.end) + 4);

        svg.append("circle")
            .attr("cx", barX + barWidth / 2)
            .attr("cy", (y(segment.start) + y(segment.end)) / 2)
            .attr("r", 2)
            .attr("fill", "black")
            .attr("pointer-events", "none");
    }
}

export function drawVisualization(container, trial) {
    const drawFunctions = {
        bar: drawBarChart,
        pie: drawPieChart,
        stackedBar: drawStackedBarChart
    };

    const draw = drawFunctions[trial.visualization];
    if (!draw) {
        throw new Error(`Unknown visualization: ${trial.visualization}`);
    }

    draw(container, trial);
}