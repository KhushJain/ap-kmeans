import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { kmeans } from "ml-kmeans";
//import RawPositioning from './RawPositioning.js'
// import Radviz from './RadvizSTD.js'
//import 'rc-slider/assets/index.css';

export default function AppSTD() {

	const [rawData, setRawData] = useState([])
	const [data, setData] = useState({});
	const [hoverKey, setHoverKey] = useState(-1)
	const [X, setX] = useState([])
	const loadData = async () => {
			let res = await axios('./Data/postmapping.json')
			let data = res.data.map((d, i) => ({key: i, ...d}))

			//getting all the values of x and y coordinates
			const temp = data.map((d, i) => ([d.coordinates.x, d.coordinates.y]))
			
			//kmeans clustering
			const { clusters } = kmeans(temp, 10);

			//adding cluster number to each data point
			data.forEach((d, i) => {
				d.cluster = clusters[i]
			})

			console.log(data)
			console.log(clusters)
			setRawData(data)
			setX(temp)
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
		
		loadData()
		
		//creating variable x with all x and y coordinates
		//const temp1 = rawData.map((d, i) => [d.x, d.y])
	
		//setX(temp)
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
			Hello
		</div >
	);
}

