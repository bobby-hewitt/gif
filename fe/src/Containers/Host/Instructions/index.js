import React, {useEffect, Fragment} from 'react';
import { Title } from 'Components' 

function Instructions(props) {
	
	useEffect(() => {
		console.log('complete')
		props.onComplete()	
	},[])

	return (     
		<Fragment>
			
		</Fragment> 
	);
}

export default Instructions;

