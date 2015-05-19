var loax_pool = {
		"dashboard_stat_tmpl" : $loc.tmpl + "dashboard-stats.tmpl"
}

var loax = (function() {
	return {
		build : function() {
			/* Set page title */
			set_page_title($nav.dashboard_stats.title);
			$(".main-body").append(file_pool.dashboard_stat_tmpl()).after(lb(1));
			init();
		},
		init : function(){
			//init();
		}
	}
}());

var init = function() {
	$.getJSON("/rest/statistic/home", function(result) {
		var pieData = [];
		pieData[0] = ["Page d'accueil",result.homeViews];
		pieData[1] = ["Articles",result.articleViews];
		$('#home-container').highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false
			},
			title: {
				text: "Nombre d'accès au site (visiteur non unique)"
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
				name: 'Nombre de vues',
				data: pieData
			}]
		});
	});
};