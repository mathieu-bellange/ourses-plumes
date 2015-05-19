jQuery.fn.extend({
	pieChart : function(pieData, pieTitle, dataName){
		$(this).highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false
			},
			title: {
				text: pieTitle
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.y}</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y}',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series: [{
				type: 'pie',
				name: dataName,
				data: pieData
			}]
		})
	},
	
	lineChart : function(lineData, x_axis, lineTitle, y_axis_title){
		$(this).highcharts({
			title: {
				text: lineTitle,
				x: -20 //center
			},
			xAxis: {
				categories: x_axis
			},
			yAxis: {
				title: {
					text: y_axis_title
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},
			series: lineData
		})
	}
});

var loax_pool = {
		"dashboard_stat_tmpl" : $loc.tmpl + "dashboard-stats.tmpl"
}

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.dashboard_stats.title);
			$(".main-body").append(file_pool.dashboard_stat_tmpl()).after(lb(1));
			dashboard.init();
		}
	}
}());

var dashboard = (function(){
	return {
		build_line_data : function(stats){
			var cat = [];
			var stat_data = [];
			
			var firstDay = new Date(stats[0].countDay);
			var lastDay = new Date(stats[stats.length-1].countDay);
			var nextMonth = new Date();
			nextMonth.setDate(firstDay.getDate() + 30);
			//on affiche les données que sur 1 mois
			if (nextMonth.getTime() >= lastDay.getTime()){
				stats.forEach(function(stat){
					cat.push(dayOfMonthToString(new Date(stat.countDay)));
					stat_data.push(stat.viewCount);
				});
			}
			//on affiche les données sur plusieurs mois
			else{
				var countOfMonth = 0;
				var month = firstDay;
				stats.forEach(function(stat){
					if (new Date(stat.countDay).getMonth() === month.getMonth()){
						countOfMonth = countOfMonth + stat.viewCount;
					}else{
						cat.push(monthOfYearToString(month));
						stat_data.push(countOfMonth);
						countOfMonth = stat.viewCount;
						month = new Date(stat.countDay);
						if (month.getTime() === lastDay.getTime()){
							cat.push(monthOfYearToString(month));
							stat_data.push(countOfMonth);
						}
					}
				});
			}
			return {x_axis : cat, data : stat_data};
		},
		init : function() {
			$.getJSON("/rest/statistic/home", function(result) {
				//tri des dates
				result.statistics.sort(function(a,b){
					if (a.countDay > b.countDay) {
					    return 1;
					  }
					  if (a.countDay < b.countDay) {
					    return -1;
					  }
					  return 0;
				});
				//pie chart
				var pie_data = [["Page d'accueil",result.homeViews],["Articles",result.articleViews]];
				$('#home-pie-container').pieChart(pie_data, "Nombre d'accès au site (visiteur non unique)", 'Nombre de vues');

				//line charts
				var stats = dashboard.build_line_data(result.statistics);
				var line_data = [{name : "Accueil", data : stats.data}];
				$('#home-line-container').lineChart(line_data, stats.x_axis, "Nombre du vue de la page d'accueil",'Nombre de vues (non unique)');
			});
		}
	}
}());
