import React from 'react'
import './style.scss'

export default (props) => {
	const { onClick, text } = props
	
	return(
		<div className="buttonContainer">
			<div className="buttonInner" onClick={onClick}>
			<p>{text}</p>
			</div>
		</div>	
		
	)
	
}
	
