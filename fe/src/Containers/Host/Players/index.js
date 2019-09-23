import React, {useContext, useEffect, Fragment}  from 'react'
import Context from 'Containers/Host/context'
import { Title } from 'Components'
import './style2.scss'

const seats = [6,4,2,0,1,3,5,7]

export default (props) => {
	const state = useContext(Context)
	

	
	useEffect(() => {
		
	},[state.players, props.players])
	const isEven = state.players.length % 2 === 0
	return(
		<div className="playersOuterContainer">
			
			<div className="seatRow zeroRow">
			{seats.map((seat, i) => {
				// const isVisible = state.route === 'welcome'
				const isVisible = (state.route === 'final-round-ballot' || state.route === 'player-response') ? false :  true
				return(
					<div className={`userContainer ${i === 3 && 'aisle'} ${isVisible && 'isVisible'}`}>
					<img src={require('assets/svg/seat.svg')} />
					</div>
				)
			})}	
			</div>
			<div className="seatRow firstRow">
			{seats.map((seat, i) => {
				// const isVisible = state.route === 'welcome'
				const isVisible = (state.route === 'final-round-ballot' || state.route === 'player-response') ? false :  true
				return(
					<div className={`userContainer ${i === 3 && 'aisle'} ${isVisible && 'isVisible'}`}>
					<img src={require('assets/svg/seat.svg')} />
					</div>
				)
			})}	
			</div>


			<div className="seatRow secondRow">
			{seats.map((seat, i) => {
				if (state.players && state.players[seat]){
					const player = state.players[seat]
					// var isVisible = (state.route === 'welcome' || state.route === 'scores' || state.route === 'final-scores' || player.hasResponded)
					// if (state.route === 'final-round-ballot'){
					// 	isVisible = false
					// }
					const isVisible = (state.route === 'final-round-ballot' || state.route === 'player-response') ? false :  true
					return(
						<div className={`userContainer ${i === 3 && 'aisle'} ${isVisible && 'isVisible'}`}>
							<img className="userImage" src={require(`assets/svg/justUser${i % 3}.svg`)} />
							<img src={require('assets/svg/userSeat.svg')} />
							<Title text={state.players[seat].name}/>
							{(state.route === 'scores' || state.route === 'final-scores') &&
								<div className="playerScoreContainer" style={{transform:`translateY(${state.route === 'scores' ? (-0.6 * 1/state.players.length) * state.players[seat].score : 0}px)`}}>
									<Title text={state.players[seat].score}/>
								</div>
							}
						</div>
					)
				} else {
				// const isVisible = (state.route === 'welcome')
					const isVisible = (state.route === 'final-round-ballot' || state.route === 'player-response') ? false :  true
					return(
						<div className={`userContainer ${isVisible && 'isVisible'}`}>
						<img src={require('assets/svg/seat.svg')} />
						</div>
					)
				}
			})}	
			</div>	
		</div>
	)
	
}
	
