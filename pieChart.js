var numbers = [
  [
    {name: 'Drivers License', val: 18, color: '#406080'},
    {name: 'Source Code', val: 7,  color: '#4DA6FF'},
    {name: 'GLBA', val: 23, color: '#7ACC29'},
    {name: 'CCN', val: 62, color: '#F2CC0C'},
    {name: 'PCI', val: 11, color: '#FF3333'},
    {name: 'SSN', val: 5, color: '#B20000'},
  ],
  [
    {name: 'Drivers License #2', val: 10, color: '#406080'},
    {name: 'Source Code #2', val: 20,  color: '#4DA6FF'},
    {name: 'GLBA #2', val: 58, color: '#7ACC29'},
    {name: 'CCN #2', val: 53, color: '#F2CC0C'},
    {name: 'PCI #2', val: 39, color: '#FF3333'},
    {name: 'SSN #2', val: 13, color: '#B20000'},
  ]
];

var sumVal = numbers[0].reduce((a, b) => a + b.val, 0);
const pie = d3.pie().value(d => d.val).sort(null);
const slices = pie(numbers[0]);
const arc = d3.arc().innerRadius(0).outerRadius(150);
const svg = d3.select('svg.chart').attr('height', 300).attr('width', 300);
let g = svg.append('g').attr('transform', 'translate(150, 150)');

createDataList(slices, '.pie-chart-list');
  
var slicesPie = g.selectAll('path.slice')
  .data(slices)
  .enter()
  .append('path')
  .attr('class', 'slice')
  .on('mouseover', function(slice) {
    var cc = 360 / Math.PI * 2;
    var angle = (slice.startAngle + ((slice.endAngle - slice.startAngle) / 2)) * cc / 4;
    var outerX = 150 * Math.sin(Math.PI * 2 * angle / 360);
    var outerY = 150 * Math.cos(Math.PI * 2 * angle / 360);
    var finalX = 250 + outerX;
    var finalY = 200 - outerY;

    d3.select('#tooltip')
      .style('left', finalX + 'px')
      .style('top', finalY + 'px')
      .style('background-color', slice.data.color)
      .style('border', '2px solid #fff')
      .style('color', '#fff')
      .select('#value')
      .text((slice.data.val/sumVal * 100).toFixed(1) + '% ' + slice.data.name);
    d3.select('#tooltip').classed('hidden', false);
  })
  .on('mouseout', function(slice) {
    d3.select('#tooltip').classed('hidden', true);
  })
  .attr('d', arc)
  .attr('fill', d => d.data.color)
  .attr('stroke', 'white')
  .attr('stroke-width', 2);

$(document).on('change', '#pie-chart-selector', function() {
  var data = numbers[$(this).val()];
  sumVal = data.reduce((a, b) => a + b.val, 0);
  createDataList(data, '.pie-chart-list');
  slicesPie.data(pie(data)).transition().duration(750).attrTween("d", function arcTween(a, index) {
    var d = this._current || slices[index];
    var i = d3.interpolate(d, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  });
});

// TODO: use this code for labels
/*
 g.append("text")
    	.attr("transform", function(d) {
        var _d = arc.centroid(d);
        _d[0] *= 1.5;	//multiply by a constant factor
        _d[1] *= 1.5;	//multiply by a constant factor
        return "translate(" + _d + ")";
      })
      .attr("dy", ".50em")
      .style("text-anchor", "middle")
      .text(function(d) {
        if(d.data.percentage < 8) {
          return '';
        }
        return d.data.percentage + '%';
      });
 */