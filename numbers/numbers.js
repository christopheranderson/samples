(function(myD3) {
  var d3 = myD3;
  var w = 400; // Grid width in px
  var h = 400; // Grid height in px
  var cs = 40; // cell size
  var r = cs / 2; // cell radius
  var ts = cs * 0.8;
  var digits = 10;
  var rows = Math.ceil(w / cs); // Number of rows in Grid
  var cols = Math.ceil(h / cs); // Number of columns in Grid

  var colors = ['#e09306', '#a360f9', '#6f8d2b', '#8dcd16', '#49b1be',
    '#1c3ab7', '#fb1899', '#551cb3', '#25cc17', '#ec3f13'
  ];

  var dragFunctions = (function() {
    var obj = {};
    var path = [];
    var down = false;
    var points = 0;

    function addItem(curr, d) {
      path.push(d);
      curr.classed('cell-selected', true);
      curr.select('rect')
        .attr('fill', 'black');
    }

    obj.mousedown = function() {
      d3.event.preventDefault();
      path = [];
      down = true;
      var curr = d3.select(this);
      curr.each(function(d) {
        addItem(curr, d);
      });
    };

    obj.mouseover = function() {
      if (down) {
        var curr = d3.select(this);
        curr.each(function(d) {
          if (0 > path.indexOf(d)) {
            var prev = path[path.length - 1];
            console.log();
            // Detect if it's adjacent in position and value
            if ((((prev.val === (digits - 1) || prev.val ===
                    0) &&
                  (d.val === (digits - 1) ||
                    d.val === 0)) //Check for 9 & 0 case
                || ((prev.val - 1) <= d.val &&
                  d.val <= (prev.val + 1))) &&
              (
                (d.x === prev.x && (d.y + cs) === prev.y) ||
                (d.x === prev.x && (d.y - cs) === prev.y) ||
                (d.y === prev.y && (d.x + cs) === prev.x) ||
                (d.y === prev.y && (d.x - cs) === prev.x)
              )) {
              // Add the item to the path
              addItem(curr, d);
            }
          }
        });
      }
    };

    obj.mouseup = function() {
      down = false;


      // Reset the style
      var grid = d3.selectAll('.cell-selected')
        .classed('cell-selected', false);

      grid.select('rect')
        .attr('fill', function(d) {
          return colors[d.val];
        });

      // Process the path
      console.log(path);
      if (path.length >= 3) {
        points += path.length * path.length;

        grid.each(function(d) {
          d.val = Math.floor(Math.random() * 10);
        });
        grid.select('rect')
          .transition()
          .duration(1000)
          .attr('fill', function(d) {
            return colors[d.val];
          });
        grid.select('text')
          .transition()
          .duration(333)
          .attr('font-size', (ts * 1.2) + 'px')
          .attr('y', function(d) {
            return d.y + r / 1.5;
          })
          .transition()
          .duration(333)
          .attr('font-size', '0px')
          .attr('y', function(d) {
            return d.y;
          })
          .transition()
          .duration(333)
          .attr('font-size', ts + 'px')
          .attr('y', function(d) {
            return d.y + r / 2;
          })
          .text(function(d) {
            return d.val;
          });
      }
      console.log('Points: ' + points);
    };

    return obj;
  })();

  var cells = d3.range(0, rows * cols)
    .map(function(d) {
      var col = d % cols;
      var row = (d - col) / cols;
      return {
        val: Math.floor(Math.random() * 10),
        r: row,
        c: col,
        x: col * cs + r,
        y: row * cs + r
      };
    });

  var svg = d3.select('#game')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // Add cells
  var cell = svg.selectAll('.cell')
    .data(cells)
    .enter()
    .append('g')
    .attr('class', 'cell')
    .on('mousedown', dragFunctions.mousedown)
    .on('mouseover', dragFunctions.mouseover)
    .on('mouseup', dragFunctions.mouseup);


  cell.append('rect')
    .attr('width', cs)
    .attr('height', cs)
    .attr('x', function(d) {
      return d.x - r;
    })
    .attr('y', function(d) {
      return d.y - r;
    })
    .attr('fill', function(d) {
      return colors[d.val];
    });

  cell.append('text')
    .text(function(d) {
      return d.val;
    })
    .attr('x', function(d) {
      return d.x;
    })
    .attr('y', function(d) {
      return d.y + r / 2;
    })
    .attr('font-size', ts + 'px')
    .attr('fill', 'white')
    .attr('text-anchor', 'middle');



  console.log('numbers.js loaded');
})(d3);
