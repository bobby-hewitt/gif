import React, {useState, useEffect, useContext, Fragment}  from 'react'
import Context from 'Containers/Participant/context'
import { Button, TextInput } from 'Components'
import './style.scss'

export default (props) => {
	const { players, onSubmit } = props
	console.log(props)
	const onClick = (i) => {
		onSubmit(i)
	}
	// useEffect(() => {

	// 	let vote = Math.random() > 0.5 ? 1 : 0	
	// 	console.log('voting', vote)
	// 	onSubmit(vote)
	// },[players])
	return(
		<div className="voteContainer">




			{players && players.map((player, i) => {
				if (player.name !== props.name){
				return (
					<Button key={i} text={player.answer} onClick={onClick.bind(this, i)} />
				)
				} else {
					return <div key={i} />
				}
			})}
			
		</div>
	)
	
}
	
