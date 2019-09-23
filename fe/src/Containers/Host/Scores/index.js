import React, {useEffect, useContext,useState, Fragment} from 'react';
import { Title } from 'Components' 
import Context from 'Containers/Host/context'
import './style.scss'

function Scores(props) {
	const state = useContext(Context)
	const [podium, setPodium ] = useState(false)
	const [showPodiumPosition, setShowPodiumPosition ] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			updatePlayers()
		},1000)
	},[])

	function updatePlayers(){
		let newPlayers = Object.assign([],state.players)
		for (var i in newPlayers){
			newPlayers[i].score += newPlayers[i].roundScore 
			newPlayers[i].roundScore = 0	
		}
		state.setPlayers(newPlayers)
		if (props.nextRound){
			setTimeout(() => {
				props.nextRound()
			},3000)
		}else {
			showEnd()
		}
	}

	function showEnd(){
		let newPlayers = Object.assign([],state.players)
		newPlayers.sort((a,b) => {
			if (a.score > b.score) {
				return -1;
			}
			if (a.score < b.score) {
				return 1;
			}
			return 0;
		})
		
		setPodium([newPlayers[1],newPlayers[0], newPlayers[2]])
		for (var i = 3; i > 0; i--){
			setTimeout(() => {
				setShowPodiumPosition(i)
			}, (3-i) * 500)
		}
		setTimeout(() => {
			props.gameOver()
		},2000)

	}


	return (     
		<div className="scoresContianer">
			
			{podium && podium.map((player, i) => {
				return(
					<div className={`podiumPosition podiumPosition${i} ${showPodiumPosition >= i && 'show'}`} >
						<p className="position">{(i + 1)}</p>
						<Title text={player.name} />
						<p className="score">{player.score}</p>
					</div>
				)
			})}
		
		</div> 
	);
}

export default Scores;

