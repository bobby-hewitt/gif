const initialState = {
	host: false,
	players: [
		// {
		// 	name: 'Player1',
		// 	id: '01',
		// 	position:0,
		// 	score: 0,
		// 	roundScore: 200,
		// 	answers: [],
		// 	isConnected: true,
		// 	gifs: {
		// 		0:[],
		// 		1:[],
		// 		2:[]
		// 	}
		// },
		// {
		// 	name: 'Player2',
		// 	id: '02',
		// 	position:0,
		// 	score: 0,
		// 	roundScore: 200,
		// 	answers: [],
		// 	isConnected: true,
		// 	gifs: {
		// 		0:[],
		// 		1:[],
		// 		2:[]
		// 	}
		// },
		// {
		// 	name: 'Player3',
		// 	id: '02',
		// 	position:0,
		// 	score: 0,
		// 	roundScore: 200,
		// 	answers: [],
		// 	isConnected: true,
		// 	gifs: {
		// 		0:[],
		// 		1:[],
		// 		2:[]
		// 	}
		// },
		// {
		// 	name: 'Player4',
		// 	id: '02',
		// 	position:0,
		// 	score: 0,
		// 	roundScore: 200,
		// 	answers: [],
		// 	isConnected: true,
		// 	gifs: {
		// 		0:[],
		// 		1:[],
		// 		2:[]
		// 	}
		// },
	],
	
	route: 'welcome',
	rounds: [],
	round: 0,
	responseIndex: 0,
	showVotes: {
		max:null,
		index:0,
		showScore:false,
	}
}
export default initialState