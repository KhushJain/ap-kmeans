import { useEffect, useState } from "react"
import Plot from 'react-plotly.js';

export default function Graph({data}) {
    const [value, setValue] = useState();
    const [layout, setLayout] = useState();
    useEffect(() => {
        let x = data.map((d, i) => (d.coordinates.x))
        let y = data.map((d, i) => (d.coordinates.y))
        let trace = {
            x: x,
            y: y,
            mode: 'markers',
            type: 'scatter'
        }
        let plotData = [trace];
        let tempLayout = {
            title: 'scatter plot',
            height: 600,
            width: 600,
            xaxis: {title: 'x'},
            yaxis: {title: 'y'},
            scattergap: 0.1,
        }
        setValue(plotData)
        setLayout(tempLayout)

        //console.log(value === undefined)
    }, [setValue])

    return (
        <>
       {value !== undefined && layout !== undefined && <Plot data={value} layout={layout} />}   
       </>
    )
}
