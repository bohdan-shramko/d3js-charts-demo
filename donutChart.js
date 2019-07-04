var numbersDonut = [
  [
    {name: 'Critical', val: 123, color: '#B20000'},
    {name: 'High', val: 122,  color: '#FF3333'},
    {name: 'Medium', val: 120, color: '#F2CC0C'},
    {name: 'Low', val: 365, color: '#7ACC29'},
    {name: 'Information', val: 238, color: '#4DA6FF'},
    // {name: 'Total Events', val: 5, color: 'orange'},
  ],
  [
    {name: 'Critical', val: 50, color: '#B20000'},
    {name: 'High', val: 87,  color: '#FF3333'},
    {name: 'Medium', val: 190, color: '#F2CC0C'},
    {name: 'Low', val: 150, color: '#7ACC29'},
    {name: 'Information', val: 500, color: '#4DA6FF'},
    // {name: 'SSN #2', val: 13, color: 'orange'},
  ]
];

const pieDonut = d3.pie().value(d => d.val).sort(null);
const slicesDonut = pieDonut(numbersDonut[0]);
const arcDonut = d3.arc().innerRadius(90).outerRadius(150);
const svgDonut = d3.select('svg.donut-chart')
                   .attr('height', 300)
                   .attr('width', 300)
                   .append('g').attr('transform', 'translate(150, 150)');
var sumDonutVal = numbersDonut[0].reduce((a, b) => a + b.val, 0);
slicesDonut.push({
  data: {
    name: "Total Events",
    val: sumDonutVal,
    color: '#4D6680'
  }
})
createDataList(slicesDonut, '.donut-chart-list');
slicesDonut.pop();

var donutSlices = svgDonut.selectAll('path.donut-slice')
        .data(slicesDonut)
        .enter()
        .append("path")
        .attr('class', 'donut-slice')
        .on('mouseover', function(slice) {
          var cc = 360 / Math.PI * 2;
          var angle = (slice.startAngle + ((slice.endAngle - slice.startAngle) / 2)) * cc / 4;
          var outerX = 150 * Math.sin(Math.PI * 2 * angle / 360);
          var outerY = 150 * Math.cos(Math.PI * 2 * angle / 360);
          var finalX = 250 + outerX;
          var finalY = 600 - outerY;
      
          d3.select('#tooltip')
            .style('left', finalX + 'px')
            .style('top', finalY + 'px')
            .style('background-color', slice.data.color)
            .style('border', '2px solid #fff')
            .select('#value')
            .text(slice.data.val + " " + slice.data.name + " Risk Events");
          d3.select('#tooltip').classed('hidden', false);
        })
        .on('mouseout', function(slice) {
          d3.select('#tooltip').classed('hidden', true);
        })
        .attr("d", arcDonut)
        .style("fill", function(d,i) {return d.data.color;})
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

var eventsTotalText = svgDonut.append("text")
           .attr("text-anchor", "middle")
           .attr('font-size', '40px')
           .attr('y', -5)
           .attr('fill', '#4D6680')
           .text(sumDonutVal);

svgDonut.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '18px')
        .attr('y', 30)
        .attr('fill', '#4D6680')
        .text("Total Events");

$(document).on('change', '#donut-chart-selector', function() {
  var data = numbersDonut[$(this).val()];
  sumDonutVal = data.reduce((a, b) => a + b.val, 0);
  eventsTotalText.text(sumDonutVal);
  data.push({
    data: {
      name: "Total Events",
      val: sumDonutVal,
      color: '#4D6680'
    }
  });
  createDataList(data, '.donut-chart-list');
  data.pop();
  donutSlices.data(pie(data)).transition().duration(750).attrTween("d", function arcTween(a, index) {
    var d = this._current || slicesDonut[index];
    var i = d3.interpolate(d, a);
    this._current = i(0);
    return function(t) {
      return arcDonut(i(t));
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