import { useEffect, useState } from "react"
import Plot from 'react-plotly.js';

export default function ClusterPlot({data}) {
    const [value, setValue] = useState();
    const [layout, setLayout] = useState();
    useEffect(() => {

        //creating an array of objects with x and y coordinates and cluster number
        let temp = data.map((d, i) => ({key: i, x: d.coordinates.x, y: d.coordinates.y, cluster: d.cluster}))    
        let arr = [];

        //creating an array of objects with x and y coordinates for each cluster
        temp.forEach((d, i) => {
            if (arr[d.cluster] === undefined) {
                arr[d.cluster] = {x: [], y: [], name: 'Cluster ' + d.cluster, mode: 'markers',type: 'scatter'}
            }
            arr[d.cluster].x.push(d.x); 
            arr[d.cluster].y.push(d.y)})
        console.log(arr)

        let plotData = arr;
        let tempLayout = {
            title: 'Cluster Plot',
            height: 600,
            width: 600,
            xaxis: {title: 'x'},
            yaxis: {title: 'y'},
            
        }
        setValue(plotData)
        setLayout(tempLayout)

        console.log(value === undefined)
    }, [setValue])

    return (
        <>
       {value !== undefined && layout !== undefined && <Plot data={value} layout={layout} />}
        
       </>
    )
}
