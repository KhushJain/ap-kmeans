import React, { useRef, useEffect } from 'react';
import { select, axisBottom, scaleLinear, axisLeft,  extent } from 'd3';
import * as d3 from 'd3'
const DGraph = ({data}) => {

    const svgRef = useRef(); 
    const divRef = useRef();
    const width = 600;
    const height = 600;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };
    

    useEffect(() => {

        let transform;
        const xScale = scaleLinear()
                      .domain(extent(data.map(d => d.coordinates.x)))
                      .range([margin.left, width - margin.right])
                      //.nice()

        const yScale = scaleLinear()
                      .domain(extent(data.map(d => d.coordinates.y)))
                      .range([height - margin.bottom, margin.top])
                      //.nice()

        const delaunay = d3.Delaunay.from(data, d => xScale(d.coordinates.x), d => yScale(d.coordinates.y));
        
        const xAxis = axisBottom(xScale).tickValues(xScale.ticks(10));
        const yAxis = axisLeft(yScale).tickValues(yScale.ticks(10));
       

        const svg = select(svgRef.current);
        const div = select(divRef.current);

        const coordinate = svg.select(".graph").selectAll(".coordinate");

        const zoom = d3.zoom().on("zoom", e => {  
            svg.selectAll(".graph").attr("transform", (transform = e.transform));
            svg.selectAll(".graph").style("stroke-width", 3 / Math.sqrt(transform.k));
            svg.selectAll(".graph").selectAll(".coordinate").attr("r", 3 / Math.sqrt(transform.k));
          });

        div.select("tooltip")
        .style("opacity", 0);

        svg.attr('width', width - margin.left - margin.right)
           .attr('height', height - margin.top - margin.bottom)
           .attr("viewBox", [0, 0, width, height]);

        svg.attr("overflow", "visible");
        
        svg
        .select(".x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)

        svg
        .select(".y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)

        svg.selectAll(".actualXValue").remove();
        svg.append("text")
        .attr("class", "actualXValue")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .attr("font-size", "130%")
        .attr("font-family", "Serif")
        .attr("x", width - margin.bottom + 10)
        .attr("y", height - 2)
        .text("X Value");

        svg.selectAll(".actualYValue").remove();

        svg
        .append("text")
        .attr("class", "actualYValue")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .attr("font-size", "130%")
        .attr("font-family", "Serif")
        .attr("y", margin.left - 35)
        .attr("x", -margin.top + 10)
        .text("Y Value");

        svg.call(zoom)
        .call(zoom.transform, d3.zoomIdentity)
        .on("pointermove", event => {
            const p = transform.invert(d3.pointer(event));
            const i = delaunay.find(...p);
            coordinate.classed("highlighted", (_, j) => i === j);
            d3.select(coordinate.nodes()[i]).raise();
          }).node();
          
        svg.select(".graph").remove();
        
        svg.append("g").attr("class", "graph")
        .selectAll(".coordinate")
        .data(data)
        .join('circle')
        .attr("class", 'coordinate')
        .attr("cx", d => xScale(d.coordinates.x) )
        .attr("cy", d => yScale(d.coordinates.y) )
        .attr("r", 3)
        .attr("fill", "#00008B")
        .on("mouseover", function(d, i) {
            div.transition()
            .duration(100)
            .style("opacity", 1);

            div.selectAll("text").remove();
            div.selectAll("br").remove();
            div
            .append("text")
            .attr("class", "content")
            .attr("font-size", "180%")
            .attr("font-family", "Times New Roman")
            .text("Population Equality = " + i.data["Population Equality"])

            div.append("br")

            div
            .append("text")
            .attr("class", "content2")
            .attr("font-size", "180%")
            .attr("font-family", "Times New Roman")
            .text("Polsby Popper " + i.data["Polsby Popper"])
         })

        .on("mouseout", function(d) {
            div.transition()
            .duration('200')
            .style("opacity", 0);
        });
        
        

        svg
          .select(".y-axis")
          .selectAll('text')
          .attr("font-size", "180%")
          .attr("font-family", "Lucida Console")
 

          svg
          .select(".x-axis")
          .selectAll('text')
          .attr("font-size", "180%")
          .attr("font-family", "Lucida Console")

        svg.selectAll(".chartTitle").remove();
        svg.append("text")
        .attr("class", "chartTitle")
        .attr("x", (width / 2))             
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")  
        .attr("font-size", "190%")
        .attr("font-family", "Serif")
        .text("Scatter Plotttt");

    }, [])




    return(
        <div>
            <svg ref={svgRef}>
                <g className = "x-axis" />
                <g className = "y-axis" />
            </svg>
           <div ref={divRef} className="tooltip"></div>
        </div>
    )
};

export default DGraph;