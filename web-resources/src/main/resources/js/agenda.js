/* ------------------------------------------------------------------ */
/* # Globals */
/* ------------------------------------------------------------------ */

var loax_pool = {
	"agenda_tmpl" : $loc.tmpl + "agenda.tmpl"
}

/* ------------------------------------------------------------------ */
/* # Module */
/* ------------------------------------------------------------------ */

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.agenda.title);
			/* Insert template */
			$("main > header").after(file_pool.agenda_tmpl).after(lb(1));
			$("a.agenda.next").on("click",function(){
				buildCalendar($("a.agenda.next").data("month"),$("a.agenda.next").data("year"));
			});
			$("a.agenda.prev").on("click",function(){
				buildCalendar($("a.agenda.prev").data("month"),$("a.agenda.prev").data("year"));
			});
			getCalendarDays();
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var calendarDays;

jQuery.fn.extend({
	appendCell: function(day) {
		var td = $("<td><div class=\"href-block\"><time datetime=\"" + getDateTime(day) + "\">"+ day.getDate() +"</time></div></td>");
		//vérification que le jour ne possède pas des events enregistrés
		calendarDays.forEach(function (calendarDay){
			var theDate = new Date(calendarDay.day);
			if (theDate.getDate() === day.getDate() 
					&& theDate.getMonth() === day.getMonth() 
					&& theDate.getFullYear() === day.getFullYear()){
				var div = td.find("div").addClass("has-event");
				var ul = $("<ul>").addClass("event-list hide");
				calendarDay.events.forEach(function(event){
					var li = $("<li>").text(event.title);
					ul.append(li);
				});
				div.append(ul);
			}
		});
		this.append(td);
	},
	appendEmptyCell: function() {
		this.append($("<td>"));
	}
});

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getDaysInMonth(month, year) {
     var date = new Date(year, month, 1);
     var days = [];
     while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
     }
     return days;
}

function buildCalendar(month, year){
	$("#agenda h3").text($time.upperCaseMonths[month] + " " + year);
	var days = getDaysInMonth(month,year);
	var nextMonth;
	var nextYear;
	if (month === 11){
		nextMonth = 0;
		nextYear = year + 1;
		prevMonth = month -1;
		prevYear = year;
	}else if(month === 0){
		nextMonth = month +1;
		nextYear = year;
		prevMonth = 11;
		prevYear = year - 1;
	}else{
		nextMonth = month +1;
		nextYear = year;
		prevMonth = month -1;
		prevYear = year;
	}
	$("a.agenda.next").data("year",nextYear);
	$("a.agenda.next").data("month",nextMonth);
	$("a.agenda.prev").data("year",prevYear);
	$("a.agenda.prev").data("month",prevMonth);
	$(".date-table tbody tr").remove();
	var tr = $("<tr>");
	days.forEach(function(day){
		//premier jour du mois
		if (day.getDate() === 1){
			//append autant de td qu'il y'a de jour entre dimanche et le premier jour
			for (var i = 0; i < day.getDay(); i++) {
				tr.appendEmptyCell();
			}
			tr.appendCell(day);
		}
		//le dimanche, ajout du tr à la table et création d'une nouvelle tr
		else if(day.getDay() === 0){
			$(".date-table tbody").append(tr);
			tr = $("<tr>");
			tr.appendCell(day);
		}
		// autres jours, on ajoute juste un td
		else{
			tr.appendCell(day);
		} 
	});
	//append autant de td qu'il y'a de jour entre le dernier jour et samedi et on termine en ajoutant le dernier tr
	for (var i = days[days.length - 1].getDay(); i < 6; i++) {
		tr.appendEmptyCell();
	}
	if(tr.children().length > 0){
		$(".date-table tbody").append(tr);
	}
	bindEvent();
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getCalendarDays(){
	$.ajax({
		type: "GET",
		url: "/rest/agenda",
		contentType: "application/json; charset=utf-8",
		success: function(data, status, jqxhr) {
			calendarDays = data;
			buildCalendar(new Date().getMonth(),new Date().getFullYear());
		},
		error: function(jqXHR, status, errorThrown) {
			ajax_error(jqXHR, status, errorThrown);
			if (jqXHR.status == 404) {
				$("main > header").after(file_pool.error_tmpl).after(lb(1));
			} else {
				createAlertBox();
			}
		},
		dataType: "json"
	});
}

/* ------------------------------------------------------------------ */
/* # Live Events */
/* ------------------------------------------------------------------ */
function bindEvent(){
	$("html").on("mouseenter", ".date-table .href-block.has-event", function() {
		$(this).addClass("mouseenter");
		var handler = $(this);
		handler.data("hover", true);
		setTimeout(function() {
			if (handler.data("hover") == true) {
				handler.css("width", handler.outerWidth());
				handler.css("position", "absolute");
				handler.css("z-index", "10");
				$conf.js_fx ? handler.children(".event-list").slideDown("fast") : handler.children(".event-list").show();
			}
		}, 400);
	});
	$("html").on("mouseleave", ".date-table .href-block.has-event", function() {
		$(this).data("hover", false);
		$(this).removeClass("mouseenter");
		if ($conf.js_fx) {
			$(this).children(".event-list").slideUp("slow", function() {
				$(this).css("position", "relative");
				$(this).css("z-index", "auto");
			});
		} else {
			$(this).children(".event-list").hide();
			$(this).css("position", "relative");
			$(this).css("z-index", "auto");
		}
	});
};