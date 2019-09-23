import React, {useEffect, Fragment, useState} from 'react';
import { Title } from 'Components' 
import './style.scss'
function PlayerResponses(props) {
	const [isVisible, setIsVisible] = useState([false, false])
	

	const { players, gif, showVotes }= props

	useEffect(() => {
		var timeout = false
		timeout = setTimeout(() => {
			setIsVisible([true, false])
			timeout = setTimeout(() => {
				setIsVisible([true, true])
			},process.env.NODE_ENV==='development' ? 0 : 500)
		},process.env.NODE_ENV==='development' ? 0 : 500)
		return () => (
			clearTimeout(timeout)
		)
	},[])
	
	return (     
		<div className="hostResponsesContainer">
			<div className="responseTitleContainer">
			
			</div>
			{players && players.map((player, i) => {

				return (
					<div className={`hostResponseOuterContainer ${i === 1 && 'rightColumn'} ${isVisible[i] && 'isVisible'}`}>
						<p className={`hostResponse ${showVotes.showScore  && 'isVisible'} ${player.votes.length ? 'positive' : 'negative'}`} ><span className="whiteText">{player.name}</span> +{player.votes.length * 250}</p>
						{player.votes && player.votes.map((vote, j) => {
						return(
							<p className={`hostResponse ${j >= player.votes.length - showVotes.index   && 'isVisible'}`}key={`${i}${j}`}>{vote.name}</p>
						)
						
					})}
					<div className={`hostResponseContainer ${i ==1 && 'inverted'}`}>
					<p key={i}>{player.answer}</p>
					</div>
					</div>
				)
			})}
		</div> 
	);
}


export default PlayerResponses;

