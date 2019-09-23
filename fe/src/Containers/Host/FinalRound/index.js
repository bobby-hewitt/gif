import React, {useEffect, useState, Fragment} from 'react';
import { Title } from 'Components' 
import './style.scss'
function FinalRound(props) {
	const {gif, players, isBallot } = props
	const [ names, setNames ] = useState(false)
	const [ gold, setGold ] = useState(false)
	const [ silver, setSilver ] = useState(false)
	const [ bronze, setBronze ] = useState(false)

	useEffect(() => {
		if (props.allVotesIn){
			setTimeout(() => {
				setNames(true)
			},500)
			
			setTimeout(() => {
				setBronze(true)
			},1000)
			setTimeout(() => {
				setSilver(true)
			},1500)
			setTimeout(() => {
				setGold(true)
			},2000)
			setTimeout(() => {
				if (props.showFinalScores){
					props.showFinalScores()
				}
			},3000)
		}
	},[props.allVotesIn])
	return (     
		<Fragment>
			
			{isBallot &&
				<div className={`finalResponsesContainer ${isBallot && 'isBallot'}`}>
				<Title text="FinalRound"/>
					{players && players.map((player, i) => {
						return(
							<div key={i} className={`finalRoundResponse finalRoundResponse${i} ${i % 2 === 1 && 'inverted'}`}>
								<div className="finalRoundResponseInner">
									{names &&
									<div className="finalRoundNameContainer">
										<Title text={player.name} />
									 </div>
									}
									<p className="answer">{player.answer}</p>
									
										<div className="gold medals" style={{height: gold ? `${player.votes['0'] * (200 * (1/players.length))}px` : 0}}>
										</div>
									
									
										<div className="silver medals" style={{height: silver ? `${player.votes['1'] * (200 * (1/players.length))}px` : 0}}>
										</div>
									
									
										<div className="bronze medals" style={{height: bronze ? `${player.votes['2'] * (200 * (1/players.length))}px` : 0}}>
										</div>
									
								
								</div>
							</div>
						)
					})}
				</div>
			}
			
		</Fragment> 
	);
}

export default FinalRound;

