import React, {useState, useContext, Fragment}  from 'react'
import Context from 'Containers/Participant/context'
import { Button, TextInput } from 'Components'
import './style.scss'

export default (props) => {
	const state = useContext(Context)
	const [name, setName ] = useState()
	const [room, setRoom ] = useState(state.room)

	const onNameChange = (e) => {
		const { value } = e.target
		setName(value)
	}

	const onRoomChange = (e) => {
		const { value } = e.target
		setRoom(value.toUpperCase())
	}
	const onSubmit = () => {
		console.log('name', name)
		props.joinRoom({name, room})
	}
	return(
		<Fragment>
		
			<TextInput onChange={onRoomChange} value={room || ''}/>
			<TextInput onChange={onNameChange} value={name || ''}/>
			<Button text="Go" onClick={onSubmit} />
		
		</Fragment>
	)
	
}
	
