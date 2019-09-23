import $ from 'jquery'

function getGifs(){
	return new Promise((resolve, reject) => {
		const url = 'https://api.giphy.com/v1/gifs/trending?weirdness=10&offset=' + Math.floor(Math.random() * 300) + '&api_key=TDNhEXbgLznusuxpAjkSo8CIOXGvVoTj'
		$.get(url, (data) => {
			resolve(data.data)	
			console.log(data.data)
		})
	})
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getOpponent(i, dist, length){
	var index = i + dist > length - 1 ? i + dist - length : i + dist
	if (index === i) index +=1
	return index
}




export const createRounds = (players) => {
	console.log('creating rounds', players)
	return new Promise((resolve, reject) => {
		getGifs().then((gifs) => {
			
			var rounds = []
			var games = []
			for (var j =0; j < 3; j++){
				for (var i = 0; i < players.length; i++){
					const game1 ={
						gif: gifs[games.length + (players.length * j)].images.original.url,
						players: [
							{
								name: players[i].name,
								answer: null,
								votes: []
							},
							{
								name: players[getOpponent(i, j + 1, players.length)].name,
								answer: null,
								votes: []
							}
						]
					}
					games.push(game1)
				}
				if (j === 0){
					rounds.push(shuffle(games))
				}
				games = []
			}

			updatePlayers(rounds, players).then((data) => {
				data.rounds.push(createFinalRound(gifs[gifs.length -1].images.original.url, players))
				resolve(data)
			})
		})
	})
}

function createFinalRound(gif, players){
	var newPlayers = []
	for (var i = 0; i < players.length; i++){
		newPlayers.push({
			name: players[i].name,
			answer: null,
			votes: {
				0: 0,
				1: 0,
				2: 0
			}
		})
	}
	return {
		gif,
		players:newPlayers
	}
}



function updatePlayers(rounds, players){
	return new Promise((resolve, reject) => {
		var newPlayers = Object.assign([], players)
		for (var i = 0; i < rounds.length; i++){
			for (var j = 0; j < rounds[i].length; j++){
				const question = rounds[i][j]
				for (var k = 0; k < question.players.length; k++){
					
					const index = newPlayers.findIndex(p => p.name === question.players[k].name)
					
					newPlayers[index].gifs[i].push({
						question: j,
						player: k,
						gif: question.gif,
						response: null,
					})
				}
			}
		}
		resolve({
			players: newPlayers, 
			rounds
		})
	})	
}