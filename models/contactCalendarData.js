
var  mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_V3', {
// 														useUnifiedTopology: true,
// 														useNewUrlParser: true,
// 														});

mongoose.connect('mongodb+srv://shafis:shafis@cluster0-9fqzb.mongodb.net/test?retryWrites=true&w=majority', {
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}).then(() =>{
					console.log('DB is connected');
				}).catch(err =>{
					console.log('error: ' + err.message);
				});

var passportLocalMongoose  = require('passport-local-mongoose');

var contactCalendarDataSchema = new mongoose.Schema({

	contactName: {type: String},
	
	email: {type: String},
	
	phoneNumber: {type: Number},
	
	message: {type: String}, 
	
	contactedOn: {type: Date, default: Date.now},
	
});


contactCalendarDataSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('contactCalendarData', contactCalendarDataSchema);


