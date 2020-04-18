
	console.log('from jslogic.js')

	var date = new Date();

	console.log('date in footer: '+ date);

	document.querySelector('#datetime').innerHTML = '&nbsp'+date.toLocaleDateString();

	let calendarHeight = getComputedStyle(document.querySelector('.calendar')).height;

	console.log('at JS logic' + calendarHeight);

	//document.querySelector('.registerPage').style.height = calendarHeight;






	
		
	    
  











