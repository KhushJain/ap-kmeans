//to do: create a box outside which it does not show the points

import React, { useState, useRef, useEffect } from 'react';
import { select, axisBottom, scaleLinear, axisLeft,  extent, max, min } from 'd3';
import * as d3 from 'd3'
import randomColor from 'randomcolor';
import { kmeans } from 'ml-kmeans';
const DGraph = ({data, numberOfClusters}) => {

    const svgRef = useRef(); 
    const divRef = useRef();
    const width = 600;
    const height = 600;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };
    const [value, setValue] = useState(data);
    //hardcode 10 random colors for the clusters
    const clusterColors = ["#cf7efd", "#7efdcf", "#7e9efd", "#fd7e7e", "#5e20b2", "#df6cc2" ,"#af4e35", "#87693b", "#30b54a", "#b5b5b5"]

    useEffect(() => {

        let transform;
        const xScale = scaleLinear()
                      .domain([min(data.map(d => d.coordinates.x)), max(data.map(d => d.coordinates.x))])
                      .range([margin.left, width - margin.right])
                      //.nice()

        const yScale = scaleLinear()
                      .domain([min(data.map(d => d.coordinates.y)), max(data.map(d => d.coordinates.y))])
                      .range([height - margin.bottom, margin.top])
                      //.nice()
        
        const xAxis = axisBottom(xScale).tickValues(xScale.ticks(10));
        const yAxis = axisLeft(yScale).tickValues(yScale.ticks(10));
       

        const svg = select(svgRef.current);
        const div = select(divRef.current);

        const appendPoints = (data) =>{

            svg.selectAll(".graph").remove();

            svg.append("g").attr("class", "graph")
            .selectAll(".coordinate")
            .data(data)
            .join('circle')
            .attr("class", 'coordinate')
            .attr("cx", d => xScale(d.coordinates.x) )
            .attr("cy", d => yScale(d.coordinates.y) )
            .attr("r", 3)
            .attr("fill", (d) => clusterColors[d.cluster])
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
            
        }

        const zoom = d3.zoom()
            .extent([[50, 50], [width-50, height-50]])
            .scaleExtent([1, 100])
            .on("zoom", e => {  
            //console.log(yScale.domain())

            //finding domain values so that we can use them to find new points to apply kmeans clustering
            let leftAxis = d3.axisLeft(yScale).scale(e.transform.rescaleY(yScale));
            let downAxis = d3.axisBottom(xScale).scale(e.transform.rescaleX(xScale));

            let newYDomain = leftAxis.scale().domain();
            let newXDomain = downAxis.scale().domain();
            
            //xAxis.call(d3.axisBottom(xScale).scale(d3.event.transform.rescaleX(xScale)));
            //yAxis.call(d3.axisLeft(yScale).scale(d3.event.transform.rescaleY(yScale)))

            refreshGraph(newXDomain, newYDomain);
            svg.selectAll(".graph").attr("transform", (transform = e.transform));
            svg.selectAll(".graph").selectAll(".coordinate").attr("r", 3 / Math.sqrt(transform.k));
                     

        });

          const refreshGraph = (newXDomain, newYDomain) => {
            
            //finding new points to apply kmeans clustering
            let newData = data.map((d, i) => { if(d.coordinates.x >= newXDomain[0] && d.coordinates.x <= newXDomain[1] && d.coordinates.y >= newYDomain[0] && d.coordinates.y <= newYDomain[1]) {return d} })
            newData = newData.filter(d => d !== undefined)
            
            //finding coordinates of the new points
            let coordinateCopy = newData.map((d, i) => ([d.coordinates.x, d.coordinates.y]))
            
            //finding number of previous circles
            const numberOfPrevCircle = svg.selectAll(".graph").selectAll(".coordinate").size();
            
            if(Math.abs(numberOfPrevCircle - newData.length) < 10) return;
            if(newData.length < numberOfClusters) return; 

            //applying kmeans clustering
            const { clusters } = kmeans(coordinateCopy, numberOfClusters);
            newData.forEach((d, i) => {
                d.cluster = clusters[i]
            })

            appendPoints(newData);
            
        }

        div.select("tooltip")
        .style("opacity", 0);

        svg.attr('width', width - margin.left - margin.right)
           .attr('height', height - margin.top - margin.bottom)
           .attr("viewBox", [0, 0, width, height]);

       //svg.attr("overflow", "visible");
        // svg
        // .select(".x-axis")
        // .attr("transform", `translate(0,${height - margin.bottom})`)
        // .call(xAxis)

        // svg
        // .select(".y-axis")
        // .attr("transform", `translate(${margin.left}, 0)`)
        // .call(yAxis)

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
        .transition()
        .duration(750)
          
        appendPoints(data);

        // svg
        //   .select(".y-axis")
        //   .selectAll('text')
        //   .attr("font-size", "180%")
        //   .attr("font-family", "Lucida Console")
 

        //   svg
        //   .select(".x-axis")
        //   .selectAll('text')
        //   .attr("font-size", "180%")
        //   .attr("font-family", "Lucida Console")

        svg.selectAll(".chartTitle").remove();
        svg.append("text")
        .attr("class", "chartTitle")
        .attr("x", (width / 2))             
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")  
        .attr("font-size", "190%")
        .attr("font-family", "Serif")
        .text("Scatter Plotttt");

    }, [numberOfClusters])

    return(
        <div>
            <svg ref={svgRef}>
                <g className = "x-axis" />
                <g className = "y-axis" />
            </svg>
           <div ref={divRef} className = "tooltip"></div>
        </div>
    )
};

export default DGraph;