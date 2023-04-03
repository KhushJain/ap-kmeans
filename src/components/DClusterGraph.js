import React, { useRef, useEffect } from 'react';
import { select, axisBottom, scaleLinear, axisLeft,  extent } from 'd3';
import * as d3 from 'd3'
import randomColor from 'randomcolor';

const DGraph = ({ data, numberOfClusters }) => {

    let xValue = data.map((d, i) => (d.coordinates.x))
    let yValue = data.map((d, i) => (d.coordinates.y))
    const svgRef = useRef(); 
    const divRef = useRef();
	const legendRef = useRef();
    const width = 600;
    const height = 600;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };
    const clusterColors = randomColor({ count : numberOfClusters });


    useEffect(() => {
        const xScale = scaleLinear()
                      .domain(extent(data.map(d => d.coordinates.x)))
                      .range([margin.left, width - margin.right])
                      //.nice()

        const yScale = scaleLinear()
                      .domain(extent(data.map(d => d.coordinates.y)))
                      .range([height - margin.bottom, margin.top])
                      //.nice()

        
        const xAxis = axisBottom(xScale).tickValues(xScale.ticks(10));
        const yAxis = axisLeft(yScale).tickValues(yScale.ticks(10));
        
        const svg = select(svgRef.current);
        const div = select(divRef.current);
		const legendSvg = select(legendRef.current);

        div.select("tooltip-2")
        .style("opacity", 0);

        svg.attr('width', width - margin.left - margin.right)
           .attr('height', height - margin.top - margin.bottom)
           .attr("viewBox", [0, 0, width, height]);

        svg.attr("overflow", "visible");
        
        svg
        .select(".x-axis-2")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)

        svg
        .select(".y-axis-2")
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

		// Add the legend items to the legend SVG element
        legendSvg.selectAll('g').remove();
		legendSvg
		.selectAll('g')
		.data(clusterColors)
		.enter()
		.append('g')
		.attr('transform', (d, i) => `translate(0,${i * 20})`)
		.append('rect')
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', (d) => d);
	
		legendSvg
		.selectAll('g')
		.append('text')
		.attr('x', 20)
		.attr('y', 10)
		.style('font-size', '12px')
		.text((d, i) => `Cluster ${i + 1}`);
	
		// Style the legend SVG element
		legendSvg.attr('class', 'legend').attr('transform', `translate(${width},${-(height - margin.top - margin.bottom - margin.left - margin.right)})`);

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

        svg
        .selectAll(".coordinate")
        .data(data)
        .join('circle')
        .attr("class", 'coordinate')
        .attr("cx", d => xScale(d.coordinates.x) )
        .attr("cy", d => yScale(d.coordinates.y) )
        .attr("r", 3)
        .attr("fill", (d) => clusterColors[d.cluster])
        .on("mouseover", function(d, i) {
            d3.select(this)
            .transition()
            .duration('100')
            .attr("r", 5);

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
            d3.select(this)
            .transition()
            .duration('200')
            .attr("r", 3);

        div.transition()
          .duration('200')
          .style("opacity", 0);
        });

        svg
          .select(".y-axis-2")
          .selectAll('text')
          .attr("font-size", "180%")
          .attr("font-family", "Lucida Console")
 

          svg
          .select(".x-axis-2")
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

    }, [data, xValue, yValue])


    return(
        <div>
            <svg ref={svgRef}>
                <g className = "x-axis-2" />
                <g className = "y-axis-2" />
            </svg>
           <div ref={divRef} class="tooltip-2"></div>
		   <svg ref={legendRef} width={100} height={100} />
        </div>
    )
};

export default DGraph;