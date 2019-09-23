var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rooms = new Schema({
	short: '',
	long: ''
});
 
var Room = module.exports = mongoose.model('Rooms', Rooms);