

var  mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

// mongoose.connect('mongodb://localhost:27017/myBlogdB_3V', {
// 														useUnifiedTopology: true,
// 														useNewUrlParser: true,
// 														});
// mongoDB ATLAS link is required
mongoose.connect('*******', {
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}).then(() =>{
					console.log('DB is connected');
				}).catch(err =>{
					console.log('error: ' + err.message);
				});

var passportLocalMongoose  = require('passport-local-mongoose');

var calendarDataSchema = new mongoose.Schema({
	
	 user: {
		 
		 id: {
		 	type: mongoose.Schema.Types.ObjectId,
		 	ref: 'calendarUser'
		 },
		 name: {type: String}
	},
		
	title: String,

	description: String,

	createdOn: {type: Date, default: Date.now},

	startDate: {type: Date, default: Date.now},

	endDate: {type: Date, default: Date.now},

	statusRadio: String
		
});


calendarDataSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('calendarData', calendarDataSchema);


