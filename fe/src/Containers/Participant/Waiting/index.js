import React, { Fragment }  from 'react'
import Context from 'Containers/Participant/context'
import { Button, TextInput, Title, BodyCopy } from 'Components'


export default (props) => {
	const { action, onAction, title, bodyCopy } = props
	return(
		<Fragment>
			<Title text={title} />
			{bodyCopy &&
				<Title text={bodyCopy} />
			}
			{action &&
				<Button text={action} onClick={onAction} />
			}
		</Fragment>
	)
	
}
	
