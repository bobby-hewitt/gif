import React from 'react'

export default (props) => {
	const { text, style } = props


	
	return(
		<p className="title" style={style ? style : {}}>{text}</p>
	)
	
}
	
