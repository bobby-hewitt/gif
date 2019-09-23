import React, {useContext, useEffect, Fragment}  from 'react'
import Context from 'Containers/Host/context'
import { Title } from 'Components'
import './style.scss'

export default (props) => {
	const state = useContext(Context)
	console.log(state.players, props.players)
	useEffect(() => {
		
	},[state.players, props.players])
	const isEven = state.players.length % 2 === 0
	return(
		<div className="playersOuterContainer">
			<div className="playersFrontContainer playersContainer">
			{state.players && state.players.map((player, i) => {
				const isVisible = (state.route === 'welcome' || player.hasResponded)
				if (i % 2 === 0){
					return(
						<div key={i}className={`playerContainer ${isVisible && 'isVisible'}`}>	
						<img className="user"src={require('assets/svg/user.svg')} />
						<Title text={player.name} style={{fontSize:'30px'}}/>
						</div>
					)
				} else return <div />
				
			})}	
			</div>
			<div className={`playersBackContainer playersContainer  ${isEven && 'isEven'}`}>
			{state.players && state.players.map((player, i) => {
				if (i % 2 === 1){
				const isVisible = (state.route === 'welcome' || player.hasResponded)
					return(
						<div key={i}className={`playerContainer ${isVisible && 'isVisible'}`}>
						
						<img className="user"src={require('assets/svg/user.svg')} />
						<Title text={player.name} style={{fontSize:'30px'}}/>
						</div>
					)
				} else return <div />
			})}	
			</div>		
		</div>
	)
	
}
	
