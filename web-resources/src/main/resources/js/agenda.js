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
			$(".date-switcher").on("click", ".next", function() {
				buildCalendar($(this).data("month"), $(this).data("year"));
			});
			$(".date-switcher").on("click", ".prev", function() {
				buildCalendar($(this).data("month"), $(this).data("year"));
			});
			getCalendarDays();
			agenda_ui.init(); // initialize ui component
		}
	}
}());

/* ------------------------------------------------------------------ */
/* # Domain */
/* ------------------------------------------------------------------ */

var agenda_ui = (function() {
	var cfg = {
		"fx_d"        : 375, // [Int]  Duration of effects (ms). Default : 375
		"ev_t"        : 500, // [Int]  Timeout before showing date events (ms). Default : 500
		"show_events" : true // [Bool] Show sliding date events ? Default : true
	};
	return {
		init : function(opts) {
			cfg = $.extend({}, cfg, opts);
			$(document).on("mouseenter", ".has-event", function() {
				if (isComputer() && cfg.show_events) {
					var self = $(this);
					self.data("hover", true);
					setTimeout(function() {
						if (self.data("hover") == true) {
							self.css({"width" : self.outerWidth(), "position" : "absolute", "z-index" : "1"});
							self.children(".event-list").slideDown($conf.js_fx ? cfg.fx_d / 2 : 0);
						}
					}, cfg.ev_t);
				}
			});
			$(document).on("mouseleave", ".has-event", function() {
				if (isComputer() && cfg.show_events) {
					var self = $(this);
					self.data("hover", false);
					self.children(".event-list").slideUp($conf.js_fx ? cfg.fx_d : 0, function() {
						self.css({"width" : "", "position" : "", "z-index" : ""});
					});
				}
			});
			$(document).on("click", ".has-event", function() {
				if ($(".reveal-modal").is(":visible")) {
					if (!$("html").data("revealing-modal")) {
						$(".reveal-modal").foundation("reveal", "close");
					}
				} else {
					// Create modal
					var e = [];
					$(this).find(".event-list").children("li").each(function() {
						var title = $(this).find(".title").text().trim() || null;
						var text = $(this).find(".text").text().trim() || null;
						if (title) {e.push({"title" : title, "text" : (text ? text : null)})}
					});
					var d = $(this).find("time").first().attr("datetime") || 0;  // Datetime
					var a = d.split("-"); // YMD array
					var t = new Date(a[0], a[1], a[2]); // Timestamp
					var c = {
						"id"       : d,
						"date"     : $time.days[t.getDay()].capitalize() + " " + dateToHTML(t),
						"events"   : e
					};
					var modal = $(file_pool.date_modal_tmpl(c));
					// Append modal
					$("body").append(modal);
					// Reload SVG icons
					modal.svg_icons();
					// Initialize modal
					modal.foundation("reveal", "open");
					// Bind live events
					$(document).on("open", ".reveal-modal", function() {
						$("html").data("revealing-modal", true);
					});
					$(document).on("close", ".reveal-modal", function() {});
					$(document).on("opened", ".reveal-modal", function() {
						$("html").removeData("revealing-modal");
					});
					$(document).on("closed", ".reveal-modal", function() {
						$(this).detach();
					});
				}
			});
		}
	}
}());

var calendarDays;

jQuery.fn.extend({
	appendCell: function(day) {
		var td = $("<td><div class='over-block'><time datetime=\"" + getDateTime(day) + "\">"+ day.getDate() +"</time></div></td>");
		// vérification que le jour ne possède pas des events enregistrés
		calendarDays.forEach(function (calendarDay) {
			var theDate = new Date(calendarDay.day);
			if (theDate.getDate() === day.getDate() 
					&& theDate.getMonth() === day.getMonth() 
					&& theDate.getFullYear() === day.getFullYear()) {
				var div = td.find("div").addClass("over-block has-event");
				var ul = $("<ul>").addClass("event-list hide");
				calendarDay.events.forEach(function(event) {
					var title = $("<strong>", {"class" : "title"}).html(event.title),
					    colon = typeof(event.text) !== "undefined" ? $("<span>", {"class" : "hide"}).html("&#8201;: ") : null,
					    text = typeof(event.text) !== "undefined" ? $("<span>", {"class" : "text hide"}).html(event.text) : null;
					var li = $("<li>").html(title.add(colon).add(text));
					ul.append(li);
				});
				div.append(ul).append("<a class='over' href='javascript:void(0)'></a>");
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

function buildCalendar(month, year) {
	$("#agenda h3").text($time.months[month].capitalize() + " " + year);
	var days = getDaysInMonth(month, year);
	var nextMonth;
	var nextYear;
	if (month === 11) {
		nextMonth = 0;
		nextYear = year + 1;
		prevMonth = month -1;
		prevYear = year;
	} else if (month === 0) {
		nextMonth = month +1;
		nextYear = year;
		prevMonth = 11;
		prevYear = year - 1;
	} else {
		nextMonth = month +1;
		nextYear = year;
		prevMonth = month -1;
		prevYear = year;
	}
	$(".date-switcher .next").data("year", nextYear);
	$(".date-switcher .next").data("month", nextMonth);
	$(".date-switcher .prev").data("year", prevYear);
	$(".date-switcher .prev").data("month", prevMonth);
	$(".date-table tbody tr").remove();
	var tr = $("<tr>");
	days.forEach(function(day) {
		// premier jour du mois
		if (day.getDate() === 1) {
			// append autant de td qu'il y'a de jour entre dimanche et le premier jour
			for (var i = 0; i < day.getDay(); i++) {
				tr.appendEmptyCell();
			}
			tr.appendCell(day);
		}
		// le dimanche, ajout du tr à la table et création d'une nouvelle tr
		else if (day.getDay() === 0) {
			$(".date-table tbody").append(tr);
			tr = $("<tr>");
			tr.appendCell(day);
		}
		// autres jours, on ajoute juste un td
		else {
			tr.appendCell(day);
		} 
	});
	// append autant de td qu'il y'a de jour entre le dernier jour et samedi et on termine en ajoutant le dernier tr
	for (var i = days[days.length - 1].getDay(); i < 6; i++) {
		tr.appendEmptyCell();
	}
	if (tr.children().length > 0) {
		$(".date-table tbody").append(tr);
	}
}

/* ------------------------------------------------------------------ */
/* # AJAX */
/* ------------------------------------------------------------------ */

function getCalendarDays() {
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

// Live events go here
