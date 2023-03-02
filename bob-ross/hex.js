


var csv = [];
var rowConverter = function(data) {
    return{
        season: parseFloat(data.season),
        episode: parseFloat(data.episode),
        img:data.img_src,
        hex:data.hex_codes,
        title:data.painting_title
    }
}

d3.csv('hex_codes.csv', function(data) {
    csv.push(rowConverter(data));
}).then(function(data) {
    
    var h = 1000;
    var w = 1000;
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(csv, function(d) {return d.episode + 1;})])
        .range([0, w]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(csv, function(d) {return d.season;} )])
        .range([0, h]);

    svg.selectAll("rect")
        .data(csv)
        .enter()
        .append('rect')
        .attr("x", function(d) {
            return xScale(d.episode)
        })
        .attr("y", function(d) {
            return h - yScale(d.season)
        })
        .attr("fill", function(d) {
            return d.hex
        })
        .attr("width", xScale(1))
        .attr("height", yScale(1))
        .attr("stroke", "white")
        .on('mouseover', function(e, d){
            d3.select("#tooltip").classed("hidden", true);
            var xPosition = e.pageX;
            var yPosition = e.pageY;
            
            var tooltip_rect = this.getBoundingClientRect();
            
            //Create the tooltip label
            d3.select("#tooltip")
                .style("left", xPosition + "px")
				.style("top", yPosition + "px")		
                .select("#image")
			    .attr("src", d.img);
            
            // 460 is image width
            if (tooltip_rect.x + 460 > window.innerWidth) {
                d3.select("#tooltip")
                    .style("left", xPosition - 460 + "px");
            }
            // 412 is image height
            if (tooltip_rect.y + 412 > window.innerHeight) {
                d3.select("#tooltip")
                    .style("top", yPosition - 430 + "px");
            }

            d3.select("#painting")
                .text(d.title);

            d3.select("#painting_description")
                .text("Painted in Season " + d.season + ", Episode " + d.episode);
            
            d3.select("#tooltip").classed("hidden", false);
            
        })
        .on('mousemove', function(e, d) {
            var xPosition = e.pageX;
            var yPosition = e.pageY;

            d3.select("#tooltip")
                .style("left", xPosition + "px")
				.style("top", yPosition + "px");

            
            var tooltip_rect = this.getBoundingClientRect();
            // 460 is image width
            if (tooltip_rect.x + 460 > window.innerWidth) {
                d3.select("#tooltip")
                    .style("left", xPosition - 460 + "px");
            }
            // 412 is image width
            if (tooltip_rect.y + 412 > window.innerHeight) {
                d3.select("#tooltip")
                    .style("top", yPosition - 430 + "px");
            }
            
        })
        .on("mouseout", function(e, d){
            d3.select("#tooltip").classed("hidden", true)
        })
    
});

console.log(csv)
