const violationsChannels = [
  {name: 'SMTP', val: 40},
  {name: 'Yahoo Mail', val: 80},
  {name: 'HTTPS', val: 20},
  {name: 'HTTP', val: 60}
];

const colors = ['#4DA6FF', '#7ACC29', '#E6C317', '#FF0000'];

const width = 500,
      height = 300
      padding = 20;

const xScale = d => width / violationsChannels.length;
const yScale = d3.scaleLinear()
                 .domain([0, 100])
                 .range([0, height - padding - 10]);

const yScaleAxis = d3.scaleLinear()
                     .domain([0, 100])
                     .range([height - padding - 10, 0]);

const yAxis = d3.axisLeft().scale(yScaleAxis).ticks(5);

const xAxis = d3.axisBottom()
                .scale(
                  d3.scaleBand()
                    .domain(violationsChannels.map(it => it.name))
                    .range([0, width])
                );

const chart = d3.select('.bar-chart')
                .style('width', width + 30 + 'px')
                .style('height', height + 'px');

const chartSvg = d3.select('.bar-chart')
              .append('svg')
              .attr('width', width + 30)
              .attr('height', height);

const bar = chart.selectAll('div.bar')
                 .data(violationsChannels)
                 .enter()
                 .append('div')
                 .attr('class', 'bar')
                 .style('top', d => height - yScale(d.val) - padding + 'px')
                 .style('left', (d, i) => width / violationsChannels.length * i + 30 + xScale(d) / 3 + 'px')
                 .style('background-image', (d, i) => 'linear-gradient(' + colors[i] + ', ' + colors[i] + ', ' + colors[i] + ', rgba(255, 255, 255, 0.5))') 
                 .style('width', d => xScale(d) / 3 + 'px')
                 .style('height', d => yScale(d.val) + 'px');


var barLines = [
  [0, 20, width, 20],
  [0, 40, width, 40],
  [0, 60, width, 60],
  [0, 80, width, 80],
  [0, 100, width, 100],
  [125, 0, 125, 100],
  [250, 0, 250, 100],
  [375, 0, 375, 100],
  [500, 0, 500, 100],
];

chartSvg.selectAll('line')
        .data(barLines)
        .enter()
        .append('line')
        .attr('x1', d => d[0] + 30)
        .attr('y1', d => yScaleAxis(d[1]) + padding / 2)
        .attr('x2', d => d[2] + 30)
        .attr('y2', d => yScaleAxis(d[3]) + padding / 2)
        .attr('stroke', 'grey')
        .attr('stroke-width', 0.5)

chartSvg.append('g')
     .attr("transform", "translate(30, 10)")
     .call(yAxis);

chartSvg.append('g')
     .attr("transform", "translate(30, 280)")
     .call(xAxis);


$(document).on('click', '#bar-chart-gen-vals', function() {
  var violationsChannelsNew = [
    {name: 'SMTP', val: generateNum()},
    {name: 'Yahoo Mail', val: generateNum()},
    {name: 'HTTPS', val: generateNum()},
    {name: 'HTTP', val: generateNum()}
  ];  

  const bar = chart.selectAll('div.bar')
                 .data(violationsChannelsNew)
                 .transition()
                 .duration(750)
                 .style('top', d => height - yScale(d.val) - padding + 'px')
                 .style('height', d => yScale(d.val) + 'px');
});

function generateNum() {
  return Math.floor(Math.random() * 90) + 10;
}