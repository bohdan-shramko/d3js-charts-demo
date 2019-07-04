const dots = [
  {
    info: [25, 21, 63, 20],
    low :[57, 79, 21, 70],
    mediumn: [54, 34, 27, 10],
    high: [18, 40, 60, 81],
    critical: [28, 25, 41, 75]
  },
];

const data = dots[0];

const dotWidth = 600,
      dotHeight = 300,
      dotPadding = 30;

const lines = [
  [0, 0, 600, 0],
  [0, 20, 600, 20],
  [0, 40, 600, 40],
  [0, 60, 600, 60],
  [0, 80, 600, 80],
  [150, 0, 150, 100],
  [300, 0, 300, 100],
  [450, 0, 450, 100],
  [600, 0, 600, 100]
]

const yDotScaleAxis = d3.scaleLinear()
                     .domain([0, 100])
                     .range([dotHeight - (dotPadding * 2), 0]);


const xDotScaleAxis = d3.scaleLinear()
                        .domain([0, dotWidth])
                        .range([0, dotWidth - (dotPadding * 2)]);

const xDotScaleAxisLabels = d3.scaleBand()
                        .domain(['Logged', 'Quarantined', 'Blocked', 'Ecrypted'])
                        .rangeRound([0, dotWidth - (dotPadding * 2)]);

const dotChart = d3.select('.dot-chart')
                   .attr('width', dotWidth)
                   .attr('height', dotHeight);

const dotsValues = Object.values(data);
var dotsValuesFinal = [];

const yDotScale = d3.scaleLinear()
                 .domain([0, 100])
                 .range([0, dotHeight - (dotPadding * 2)]);

const xDotScale = d3.scaleLinear()
                    .domain([0, dotWidth])
                    .range([dotPadding, dotWidth - dotPadding]);


for (var i = 0; i < 4; i++) {
  for (var y = 0; y < dotsValues.length; y++) {
    dotsValuesFinal.push([
      dotsValues[y][i], 
      Math.floor(Math.random() * 151) + (i * 150), 
      y + 1
    ]);
  }
}

var dotsBridgeLines = [
  [],
  [],
  [],
  [],
  [],
  []
];

for (var i = 0; i < dotsValuesFinal.length; i++) {
  if (dotsValuesFinal[i]) {
    dotsBridgeLines[dotsValuesFinal[i][2]].push(dotsValuesFinal[i]);
  }
}

dotsBridgeLines.shift();

for (var i = 0; i < dotsBridgeLines.length; i++) {
  dotsBridgeLines[i].unshift([107, 0, i+1]);
  dotsBridgeLines[i].push([107, 600, i+1]);
}

var dotsBridgeLinesFinal = [];

dotsBridgeLines.map(dots => {
  dots.map((dot, index) => {
    if (index != dots.length - 1) {
      var x1 = dot[1];
      var y1 = dot[0];
      var x2 = dots[index + 1][1];
      var y2 = dots[index + 1][0];
      dotsBridgeLinesFinal.push([x1, y1, x2, y2, dot[2]]);
    }
  })
});

buildHorizontalDataList([
  {name: 'Info', color: '#4DA6FF'},
  {name: 'Low', color: '#7ACC29'},
  {name: 'Mediumn', color: '#F2CC0C'},
  {name: 'High', color: '#FF3333'},
  {name: 'Critical', color: '#B20000'}
], '.dot-chart-list');

const line = dotChart.selectAll('line')
                     .data(lines, d => d)
                     .enter()
                     .append('line')
                     .attr('x1', d => xDotScale(d[0]) + 1)
                     .attr('y1', d => yDotScale(d[1]) + 16)
                     .attr('x2', d => xDotScale(d[2]) + 1)
                     .attr('y2', d => yDotScale(d[3]) + 16)
                     .attr('fill', 'none')
                     .attr('stroke-width', 0.4)
                     .attr('stroke', 'grey');

const bridleLine = dotChart.selectAll('line.bridge')
                           .data(dotsBridgeLinesFinal, d => d)
                           .enter()
                           .append('line')
                           .attr('class', 'bridge')
                           .attr('x1', d => xDotScale(d[0]))
                           .attr('y1', d => yDotScale(d[1]))
                           .attr('x2', d => xDotScale(d[2]))
                           .attr('y2', d => yDotScale(d[3]))
                           .attr('stroke-width', 2)
                           .attr('stroke', d => {
                            switch(d[4]) {
                              case 1:
                                return '#4DA6FF';
                              case 2:
                                return '#7ACC29';
                              case 3:
                                return '#F2CC0C';
                              case 4:
                                return '#FF3333';
                              case 5:
                                return '#B20000';
                              default:
                                break;
                            }
                          });

const dot = dotChart.selectAll('circle')
                    .data(dotsValuesFinal)
                    .enter()
                    .append('circle')
                    .attr('cx', d => xDotScale(d[1]))
                    .attr('cy', d => yDotScale(d[0]))
                    .attr('r', 5)
                    .attr('fill', '#fff')
                    .attr('stroke-width', 2)
                    .attr('stroke', d => {
                      switch(d[2]) {
                        case 1:
                          return '#4DA6FF';
                        case 2:
                          return '#7ACC29';
                        case 3:
                          return '#F2CC0C';
                        case 4:
                          return '#FF3333';
                        case 5:
                          return '#B20000';
                        default:
                          break;
                      }
                    });

const dotYAxis = d3.axisLeft()
                   .scale(yDotScaleAxis)
                   .ticks(5);

const dotXAxis = d3.axisBottom()
                   .scale(xDotScaleAxisLabels);

dotChart.append('g')
        .attr('transform', 'translate(' + dotPadding + ', ' + dotPadding / 2 + ')')
        .call(dotYAxis);

dotChart.append('g')
        .attr('transform', 'translate(' + dotPadding + ', ' + (dotHeight - (dotPadding * 1.5)) + ')')
        .call(dotXAxis);

$(document).on('click', '#dot-chart-gen-vals', function() {
  var newDots = {
    info: [generateNum(), generateNum(), generateNum(), generateNum()],
    low :[generateNum(), generateNum(), generateNum(), generateNum()],
    mediumn: [generateNum(), generateNum(), generateNum(), generateNum()],
    high: [generateNum(), generateNum(), generateNum(), generateNum()],
    critical: [generateNum(), generateNum(), generateNum(), generateNum()]
  };
  
  var dotsValues = Object.values(newDots);
  var dotsValuesFinal = [];

  for (var i = 0; i < 4; i++) {
    for (var y = 0; y < dotsValues.length; y++) {
      dotsValuesFinal.push([
        dotsValues[y][i], 
        Math.floor(Math.random() * 151) + (i * 150), 
        y + 1
      ]);
    }
  }
  
  var dotsBridgeLines = [
    [],
    [],
    [],
    [],
    [],
    []
  ];

  for (var i = 0; i < dotsValuesFinal.length; i++) {
    if (dotsValuesFinal[i]) {
      dotsBridgeLines[dotsValuesFinal[i][2]].push(dotsValuesFinal[i]);
    }
  }
  
  dotsBridgeLines.shift();
  
  for (var i = 0; i < dotsBridgeLines.length; i++) {
    dotsBridgeLines[i].unshift([107, 0, i+1]);
    dotsBridgeLines[i].push([107, 600, i+1]);
  }
  
  var dotsBridgeLinesFinal = [];
  
  dotsBridgeLines.map(dots => {
    dots.map((dot, index) => {
      if (index != dots.length - 1) {
        var x1 = dot[1];
        var y1 = dot[0];
        var x2 = dots[index + 1][1];
        var y2 = dots[index + 1][0];
        dotsBridgeLinesFinal.push([x1, y1, x2, y2, dot[2]]);
      }
    })
  });

  dotChart.selectAll('line.bridge').remove();
  dotChart.selectAll('line.bridge')
          .data(dotsBridgeLinesFinal, d => d)
          .enter()
          .append('line')
          .transition()
          .duration(750)
          .attr('class', 'bridge')
          .attr('x1', d => xDotScale(d[0]))
          .attr('y1', d => yDotScale(d[1]))
          .attr('x2', d => xDotScale(d[2]))
          .attr('y2', d => yDotScale(d[3]))
          .attr('stroke-width', 2)
          .attr('stroke', d => {
           switch(d[4]) {
             case 1:
               return '#4DA6FF';
             case 2:
               return '#7ACC29';
             case 3:
               return '#F2CC0C';
             case 4:
               return '#FF3333';
             case 5:
               return '#B20000';
             default:
               break;
           }
         });

  dotChart.selectAll('circle')
         .data(dotsValuesFinal)
         .transition()
         .duration(750)
         .attr("cx", d => xDotScale(d[1]))
         .attr('cy', d => yDotScale(d[0]));
});

function generateNum() {
  return Math.floor(Math.random() * 90) + 10;
}