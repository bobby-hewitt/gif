import React, { Component } from 'react'
import './style.scss'
const angles =[0,0,0,0,0,0,0,0,0,0,0,0]
export default (props) => {
	return(
		
			<div className="anglesContainer animated">
			{angles.map((angle, i) => {
				return(
					<div key={i}className="testTriangle" style={{transform: 'rotate(' + (360 /angles.length) * i+ 'deg) translate(0%, -100%)'}}/>
				)
			})}
			</div>
		
	)
}