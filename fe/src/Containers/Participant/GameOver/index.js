import React, {useState, useContext, Fragment}  from 'react'
import Context from 'Containers/Participant/context'
import { Button, TextInput } from 'Components'


export default (props) => {
	

	
	return(
		<Fragment>
	
			<Button text="Play again" onClick={props.restartGame} />
			
		</Fragment>
	)
	
}
	
