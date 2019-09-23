import React, {useContext, Fragment}  from 'react'
import Context from 'Containers/Host/context'
import { Title } from 'Components'
import './style.scss'

export default (props) => {
	const state = useContext(Context)
	return(
		<Fragment>
			{state.host && state.host.short && 
				<div className="joinContainer">




				<Title text={'Trending.guru'}></Title>
				<p className="roomCode">Room code: <span className="bold">{state.host.short}</span></p>
				
				</div>

			}			
		</Fragment>
	)
	
}
	
