import React from 'react'
import './style.scss'

export default (props) => {
	const { onChange, value } = props
	return(
		<div className="inputContainer">
			<input type="text" value={value} onChange={onChange} />
		</div>
	)
	
}
	
