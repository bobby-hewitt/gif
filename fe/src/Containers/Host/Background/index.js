import React, {useEffect, useContext, useState, Fragment} from 'react';
import Context from 'Containers/Host/context'
import { Title, Background } from 'Components' 
import $ from 'jquery'
import './style.scss'

const angles =[0,0,0,0,0,0,0,0,0,0,0,0]
function Instructions(props) {
	const state = useContext(Context)
	const [gifs, setGifs] = useState()
	const [gifIndex, setGifIndex] = useState(0)
	const [covered, setCovered] = useState(0)
	useEffect(() => {
		var timeout 
		if (gifs){
			timeout = setCovered(true)
			setTimeout(() => {
				const newIndex = gifIndex <= gifs.length-1 ? gifIndex+1 : 0
				setGifIndex(newIndex)
				setCovered(false)
			},300)
			
		}
		return () => {
			clearTimeout(timeout)
		}




	},[state.route])

	return (     
		
			<div className="backgroundContainer">
				<Background />
				<div className={`backgroundGifContainer
					${ state.route === 'final-round-ballot' && 'shrink'} 
					${ state.route === 'welcome' && 'offsetTop'} 
					${ state.route === 'scores' && 'hidden'}
					${ state.route === 'final-scores' && 'hidden'}`}>
					<div className="backgroundGifInner">
					<div className="topJaunt" />
					<div className="bottomJaunt" />
					<div className="rightJaunt" />
					<div className="leftJaunt " />
					<div className="topInnerJaunt" />
					<div className="leftInnerJaunt " />
						<div className="mainGifInnerContainer">
						<div className={`mainGif ${state.route === 'scores' && 'knockedBack'}`}style={{backgroundImage: 'url(' + props.gif+ ')'}} />
							
						</div>
						{state.route === 'welcome' &&
							<div className="instructionsContainer">
							<Title text={'trending.guru'}></Title>
							<p className="roomCode">Room code: <span className="bold">{state.host.short}</span></p>
							</div>
							
						}
						{state.route === 'answer-input' && 
							<div className="instructionsContainer">
							<Title text={'Caption time'}></Title>
							<p className="roomCode">You've been sent 2 gifs to caption</p>
							</div>
						}
					</div>
				</div>

				
				
			</div>
		
	);
}

export default Instructions;

