import React, {useState, useEffect, useContext, Fragment}  from 'react'
import Context from 'Containers/Participant/context'
import { Button, TextInput } from 'Components'
import './style.scss'

export default (props) => {
	const state = useContext(Context)
	const [answer, setAnswer ] = useState('this is a really long anserr that is ghoing to run over several lines. Hopefully the UI will cope')

	const onAnswerChange = (e) => {
		const { value } = e.target
		setAnswer(value)
	}

	// useEffect(() => {	
	// 	props.onSubmit(answer)
	// },[])

	const onSubmit = () => {
		props.onSubmit(answer)
	}

	return(
		<Fragment>
			<TextInput onChange={onAnswerChange} value={answer || ''}/>
			<Button text="Go" onClick={onSubmit} />
		</Fragment>
	)
	
}
	
