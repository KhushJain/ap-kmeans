import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { kmeans } from "ml-kmeans";
import Graph from './components/Graph';
import ClusterPlot from './components/ClusterPlot';
import DGraph from './components/DGraph';
import DClusterGraph from './components/DClusterGraph';
import RawPositioning from './RawPositioning.js'

// import Radviz from './RadvizSTD.js'
//import 'rc-slider/assets/index.css';

export default function AppSTD() {

	const [rawData, setRawData] = useState([])
	const [processedData, setProcessedData] = useState([])
	const [hoverKey, setHoverKey] = useState(-1)
	const [coordinates, setCoordinates] = useState([]) 
	const [numberOfClusters, setNumberOfClusters] = useState(10) 

	const handleChange = (e) => {
		const n = Number(e.target.value)

		setNumberOfClusters(n)
		
		let coordinatesCopy = [...coordinates]	
		let rawDataCopy = [...rawData]
		applyClustering(coordinatesCopy, rawDataCopy, n)
	}

	const applyClustering = (coordinateCopy, dataCopy , n) => {

		//console.log(coordinateCopy)
		const { clusters } = kmeans(coordinateCopy, n);
		//console.log(kmeans(coordinateCopy, n));
		dataCopy.forEach((d, i) => {
			d.cluster = clusters[i]
		})
		setProcessedData(dataCopy)
	}

	let labelMapping = {
		'Democratic Seat Share': 'dem seat',
		'Efficiency Gap': 'eff gap',
		'Majority-Minority Seat Share': 'maj/min seat',
		'Polsby Popper': 'p Popper',
		'Population Equality': 'pop eq',
	}

	const [labelAngles, setLabelAngles] = useState({
		'Democratic Seat Share': 70,
		'Efficiency Gap': 140,
		'Majority-Minority Seat Share': 210,
		'Polsby Popper': 280,
		'Population Equality': 350
	})

	
	useEffect(() => {
		
		const loadData = async () => {
			let res = await axios('./Data/premapping.json')
			let data = res.data.map((d, i) => ({key: i, ...d}))

			let { points, labels, std } = RawPositioning(data, labelMapping, labelAngles, 'key')
			//console.log(RawPositioning(data, labelMapping, labelAngles, 'key'))
		

			setRawData(points)

			//getting all the values of x and y coordinates
			let temp = points.map((d, i) => ([d.coordinates.x, d.coordinates.y]))

			setCoordinates(temp)
			
			//kmeans clustering
			applyClustering(temp, points, 10)
		}

		loadData().catch(err => console.log("errpr" + err))

		
	}, [])


	
	// useEffect(() => {

	// 	// Statistical and Regualr require different label Mappings.
	// 	//let { points, labels, std } = RawPositioning(rawData, labelMapping, labelAngles, 'key')
	// 	// downloadObjectAsJson(points, 'text')
	// 	//setData({ points, labels, std })
	// }, [labelAngles, rawData])


	// function downloadObjectAsJson(list, exportName){
	// 	var json = JSON.stringify(list);
	// 	var blob = new Blob([json], {type: 'application/json'});
	// 	var link = document.createElement('a');
	// 	link.href = window.URL.createObjectURL(blob);
	// 	link.download = exportName;
	// 	link.click();
	//   }


	return (
		<div>
			{/* <div style={{ width: '30%', height: '100%', position: 'fixed', padding: '5px' }}>
				<div id='sidebar'>
					{useMemo(() => <Radviz
						points={data.points}
						labels={data.labels}
						hoverId={hoverKey}
						hoverOver={setHoverKey}
						showHSV={true} />, [data, hoverKey])}
				</div>
			</div> */}
			<label>Clusters</label>
			<input type="number" id="Cluster" name="Cluster" value={numberOfClusters} onChange = {handleChange}></input>
			{processedData.length > 0 && <Graph data={processedData} coordinates={coordinates} />}
			{processedData.length > 0 && <ClusterPlot data={processedData} coordinates={coordinates} />}
			{processedData.length > 0 && <DClusterGraph data={processedData} coordinates={coordinates} numberOfClusters={numberOfClusters} applyClustering={applyClustering} setNumberOfClusters={setNumberOfClusters} />}
			{processedData.length > 0 && <DGraph data={processedData} coordinates={coordinates} numberOfClusters={numberOfClusters} />}
		</div >
	);
}

