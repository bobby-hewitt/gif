import React, {useState, useContext, useEffect, Fragment}  from 'react'
import Context from 'Containers/Participant/context'
import { Button, TextInput } from 'Components'
import './style.scss'

export default (props) => {
	const state = useContext(Context)
	const [answer, setAnswer ] = useState('asdasda')

	const onAnswerChange = (e) => {
		const { value } = e.target
		setAnswer(value)
	}

	// useEffect(() => {	
	// 	props.onSubmit(answer)
	// },[state.player.gifs[state.round][state.gifIndex].gif])

	
	const onSubmit = () => {
		props.onSubmit(answer)

	}
	
	const image = state.player ?  state.player.gifs[state.round][state.gifIndex].gif : {}
	return(
		<Fragment>
			<div className="inputImage" style={{backgroundImage:`url(${image})`}} />
			
			<TextInput onChange={onAnswerChange} value={answer || ''}/>
			<Button text="Go" onClick={onSubmit} />
		</Fragment>
	)
	
}
	
