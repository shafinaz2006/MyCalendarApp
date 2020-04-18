
var mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_3V', {
// 														useUnifiedTopology: true,
// 														useNewUrlParser: true,
// 														});
// mongoDB ATLAS link is required
mongoose.connect('******', {
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}).then(() =>{
					console.log('DB is connected');
				}).catch(err =>{
					console.log('error: ' + err.message);
				});


var passportLocalMongoose  = require('passport-local-mongoose');

var calendarUserSchema = new mongoose.Schema({
	
	 username: { type: String },
	 email: { type: String },
	 	 	
});

calendarUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('calendarUser', calendarUserSchema);

