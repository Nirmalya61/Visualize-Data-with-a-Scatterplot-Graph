const url ='https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
let data = [];

let margin = {top: 40, right: 40, bottom: 60, left:70}
let widthChart = 1000 - margin.left - margin.right;
let heightChart = 560 - margin.top - margin.bottom;
const chartHandler = document.getElementById("chart");
let wrapperBox = document.getElementById("wrapper");

function parseTime(timeString) {
  let timeArray = timeString.split(":");
  let min = parseInt(timeArray[0]);
  let sec = parseInt(timeArray[1]);
  return new Date(2000,0,1,0,min,sec);
}

fetch(url)
  .then((resp)=> resp.json())
  .then(function(receivedData) {
      data = receivedData;
/* data processing */
      let minTime = new Date(parseTime(data[0].Time).getTime() - 15000);
      let maxTime = new Date(parseTime(data[data.length-1].Time).getTime() + 15000);
      let y = d3.scaleTime().domain([minTime, maxTime]).range([0, heightChart]);
      const minYear = d3.min(data.map((d)=>d.Year));
      const maxYear = d3.max(data.map((d)=>d.Year));
      let chart = d3.select(".chart")
            .attr("width",widthChart+margin.left+margin.right)
            .attr("height",heightChart+margin.top+margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      let x = d3.scaleTime().domain([minYear-1, maxYear+1]).range([0, widthChart]);
      let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
      let yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

/* drawing */
      let point = chart.selectAll("g")
          .data(data)
          .enter().append("g");

      let tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("id","tooltip")
        .style("opacity", "0");

      point.append("circle")
          .attr("class", "dot")
          .attr("cy", (d) => y(parseTime(d.Time)) )
          .attr("data-yvalue", (d) => new Date(1970, 0, 1, 0, d.Time.substr(0,2), d.Time.substr(3,2)) )
          .attr("cx", (d) => x(d.Year ) )
          .attr("data-xvalue", (d) => d.Year )
          .attr("r", 6)
          .attr("fill", function(d) {
            if (d.Doping.length>0) return 'red';
            if (d.Doping.length===0) return 'green'; })
          .attr("id", function(d) { return d.Place; })
          .on("mouseover", function(d) {
            tooltip.style("opacity", "1")
              .style("top", d3.event.pageY - 30 + "px" )
              .style("left", d3.event.pageX + 20 + "px" )
              .html( d.Name + "," + d.Nationality + "<br>" + "Year:" + d.Year + ", Time:"
                + d.Time + "<br>" + d.Doping )
              .attr("data-year", d.Year )
          })
          .on("mouseout", function(d) {
              tooltip.style("opacity", "0" );
          });

/* axes description */
      chart.append("g")
        .attr("class", "axis")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + heightChart + ")")
        .call(xAxis);

      chart.append("g")
        .attr("class", "axis")
        .attr("id", "y-axis")
        .call(yAxis);

      chart.append('text').text('Time in minutes')
                .attr("class","axis-description")
                .attr('x', 25)
                .attr('y', 140)
                .attr("transform", "rotate(-90 25 140)");

      chart.append('text').text('Source:https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
      
                .attr("class","source")
                .attr('x', -30)
                .attr('y', heightChart+50)
                .attr('fill', 'black');

      chart.append('text').text("Years")
                .attr("class", "axis-description")
                .attr('x', 850)
                .attr('y', heightChart-10)
                .attr('fill', 'black');
      chart.append('text').text("Scatterplot Graph Visualisation")
                .attr("class", "title")
                .attr("id", "title")
                .attr('x', 250)
                .attr('y',-10)
                .attr('fill', 'black');

      chart.append("rect")
          .attr("class", "legend")
          .attr("id","legend")
          .attr("x", 600)
          .attr("y", 60)
          .attr("width", 140)
          .attr("height", 60)
          .attr("fill", "#DDDDDD")
          .style("background-color", "#CCCCCC");

      chart.append('circle')
          .attr("cy", 80)
          .attr("cx", 620)
          .attr("r", 6)
          .attr("fill", 'red')
      chart.append('text').text("DOPING")
                .attr("class", "point-text")
                .attr('x', 635)
                .attr('y', 85)
                .attr('fill', 'black');

      chart.append('circle')
          .attr("cy", 100)
          .attr("cx", 620)
          .attr("r", 6)
          .attr("fill", 'green')
      chart.append('text').text("NO DOPING")
                .attr("class", "point-text")
                .attr('x', 635)
                .attr('y', 105)
                .attr('fill', 'black');

/* signature */
      chart.append('defs').append('path').attr('id','signature')
                        .attr('d','M260 20 L800 20')
                        .attr('fill','transparent');
      chart.append('use').attr('xlink:href', '#signature');
      chart.append('text')
                    .append('textPath').attr('xlink:href','#signature')
                        .text('Created by Nirmalya Mukherjee.')
                  .attr('x', 150)
                  .attr('y', 150)
                  .style('font-family', `'Bad Script'`)
                  .style ('font-size', '30px')
                  .attr('fill', '#0000FF');
})
  .catch(function(error){
    console.log(error);
  });
