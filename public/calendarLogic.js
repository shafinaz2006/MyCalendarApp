var months = ['January', 'February', 'March', 'April', 'May', 'June', 
			  'July', 'August', 'September', 'October', 'November', 'December'];
var month = 0;
var year = 0;
var date = new Date();

function addEvent(el, type, handler){
    if (!el) return
    if (el.attachEvent) el.attachEvent('on' + type, handler)
    else el.addEventListener(type, handler);
}


function loadCalendarMonths(month){

    // month = date.getMonth();
    document.getElementById('curMonth').innerHTML = months[month];
    loadCalendarDays();
    return month;

}


function loadCalendarYears(year) {
    // year = date.getFullYear();
    document.getElementById('curYear').innerHTML = year;
    loadCalendarDays();
    return year;
}

const monthPrev = function () {
    monthName = document.getElementById('curMonth').innerHTML
    month = months.indexOf(monthName) - 1;

    if(month === -1){
        month = 11;
        year = Number(document.getElementById('curYear').innerHTML) - 1;
        document.getElementById('curYear').innerHTML = year;
        loadCalendarDays();
        
    }
    document.getElementById('curMonth').innerHTML = months[month];
    loadCalendarDays();
    return month;
}

const monthNext = function () {
    
    monthName = document.getElementById('curMonth').innerHTML
    month = months.indexOf(monthName) + 1;
    if(month === 12){
        month = 0;
        year = Number(document.getElementById('curYear').innerHTML) + 1;
        document.getElementById('curYear').innerHTML = year;
        loadCalendarDays();
        
    }
    document.getElementById('curMonth').innerHTML = months[month];
    loadCalendarDays();
    return month;
}

function loadCalendarDays() {
    document.getElementById('calendarDays').innerHTML = '';

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay();       // find where to start calendar day of week

    for (var i = 0; i <= dayofweek; i++) {
        var d = document.createElement('div');
        d.classList.add('day');
        d.classList.add('blank');
        document.getElementById('calendarDays').appendChild(d);
    }

    for (var i = 0; i < num; i++) {
        var tmp = i + 1;
        var d = document.createElement('div');
        d.id = 'calendardayDiv_' + i;
        d.className = 'day';
        //d.innerHTML = tmp;
		var monthId = month + 1;
		
		var a = document.createElement('a');
		a.id = 'calendardayLink_' + i;
		a.className = 'dayLink';
		a.innerHTML = tmp;
		a.href = '/todo/year/' + year + '/month/' + monthId + '/day/' + tmp;
		
        document.getElementById('calendarDays').appendChild(d);
		document.getElementById(d.id).appendChild(a);
    }

    var clear = document.createElement('div');
    clear.className = 'clear';
    document.getElementById('calendarDays').appendChild(clear);
	
}

function daysInMonth(month, year)
{
    var d = new Date(year, month+1, 0);
    return d.getDate();
}


window.addEventListener('load', function () {
	
	var date = new Date();
	
	dayId = date.getDate() - 1;
	month = date.getMonth();
	year = date.getFullYear();
	
	console.log(month);
	
	var url = window.location.href;
	
	if (url.indexOf('year') !== -1){
		
		console.log('true');
		dayId = url.split('/')[9] - 1;
		month = url.split('/')[7] - 1;
		year = url.split('/')[5];
		console.log(month);
		
	}
	
			
    loadCalendarMonths(month);
    loadCalendarYears(year);
    loadCalendarDays();
    console.log('i"m at addEventlistener')
   
    button_prev = document.getElementById('prevMonth');
    button_next = document.getElementById('nextMonth');

    addEvent(button_prev, 'click', monthPrev)
    addEvent(button_next, 'click', monthNext)
	

	var id = '#calendardayDiv_' + dayId
	
	console.log('dayId: ' + date)
	
	var dateDiv = document.querySelector(id);
	
	dateDiv.style.backgroundColor = 'white';

	console.log('dateDiv: ' + dateDiv);
	

});

// delete button click: 

// $('ul').on('click', 'span[class= 'garbageSign']', function(event){
//     $(this).parent().fadeOut(500, function(){
//         $(this).remove();
//     })
//     event.stopPropagation();
// })

// $('.fa-plus').click(function(){
//     $('input[type = 'text']').fadeToggle();
// })

// var startYear = 2000;
// var endYear = 2020;
// function loadCalendarMonths() {
//     for (var i = 0; i < months.length; i++) {
//         var doc = document.createElement('div');
//         doc.innerHTML = months[i];
//         doc.classList.add('dropdown-item');

//         doc.onclick = (function () {
//             var selectedMonth = i;
//             return function () {
//                 month = selectedMonth;
//                 document.getElementById('curMonth').innerHTML = months[month];
//                 loadCalendarDays();
//                 return month;
//             }
//         })();

//         document.getElementById('months').appendChild(doc);
//     }
// }

// function loadCalendarYears() {
//     document.getElementById('years').innerHTML = '';

//     for (var i = startYear; i <= endYear; i++) {
//         var doc = document.createElement('div');
//         doc.innerHTML = i;
//         doc.classList.add('dropdown-item');

//         doc.onclick = (function () {
//             var selectedYear = i;
//             return function () {
//                 year = selectedYear;
//                 document.getElementById('curYear').innerHTML = year;
//                 loadCalendarDays();
//                 return year;
//             }
//         })();

//         document.getElementById('years').appendChild(doc);
//     }
// }
