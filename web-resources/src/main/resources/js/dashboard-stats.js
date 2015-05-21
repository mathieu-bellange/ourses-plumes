jQuery.fn.extend({
	pieChart : function(pieData, pieTitle, dataName, onClick){
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
				data: pieData,
				point:{
	                  events: {
	                      click: function(event){
	                    	  onClick(this);
	                      }
	                  }
	              }
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
	},
	
	barChart : function(x_axis, barData, dataName, onClick, title, y_title){
	    $(this).highcharts({
	        chart: {
	            type: 'bar'
	        },
	        title: {
	            text: title
	        },
	        xAxis: {
	            categories: x_axis,
	            title: {
	                text: null
	            }
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: y_title,
	                align: 'high'
	            },
	            labels: {
	                overflow: 'justify'
	            }
	        },
	        plotOptions: {
	            bar: {
	                dataLabels: {
	                    enabled: true
	                }
	            }
	        },
	        series: [{
				type: 'bar',
				name: dataName,
				data: barData,
				point:{
	                  events: {
	                      click: function(event){
	                    	  onClick(this);
	                      }
	                  }
	              }
			}]
	    });
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
			dashboard.init_home();
		}
	}
}());


var dashboard = (function(){
	var data;
	var rubriques_data;
	var articles_data;
	var pie_rubriques = [];
	return {
		data : function(data){
			this.data = data;
		},
		set_rubriques_data : function(data){
			rubriques_data = data;
		},
		set_articles_data : function(data){
			articles_data = data;
		},
		build_line_data : function(stats){
			//tri des dates
			stats.sort(function(a,b){
				if (a.countDay > b.countDay) {
					return 1;
				}
				if (a.countDay < b.countDay) {
					return -1;
				}
				return 0;
			});
			var cat = [];
			var stat_data = [];
			
			if (stats[0]){
				
				var firstDay = new Date(stats[0].countDay);
				var nextMonth = new Date(firstDay.getTime());
				nextMonth.setDate(nextMonth.getDate() + 30);
				//on affiche les données que sur 1 mois
				if (nextMonth.getTime() >= new Date().getTime()){
					var max_index = new Date().getDate() - firstDay.getDate() + 1;
					var index_stat = 0;
					for (var index = 0; index < max_index; index ++){
						var day = new Date();
						day.setDate(firstDay.getDate() + index);
						day.setHours(0, 0, 0, 0);
						var countDayView = 0;
						if(index_stat < stats.length && day.getTime() === new Date(stats[index_stat].countDay).getTime()){
							countDayView = stats[index_stat].viewCount;
							index_stat = index_stat + 1;
						}
						cat.push(dayOfMonthToString(day));
						stat_data.push(countDayView);
					}
				}
				//on affiche les données sur plusieurs mois
				else{
					var countOfMonth = 0;
					var month = firstDay;
					var lastMonth = new Date().getMonth();
					stats.forEach(function(stat, index){
						if (new Date(stat.countDay).getMonth() === month.getMonth()){
							countOfMonth = countOfMonth + stat.viewCount;
						}else{
							cat.push(monthOfYearToString(month));
							stat_data.push(countOfMonth);
							month = new Date(month.setMonth(month.getMonth() + 1));
							countOfMonth = 0;
							if (index === stats.length - 1){
								cat.push(monthOfYearToString(month));
								stat_data.push(stat.viewCount);
							}
						}
					});
				}
			}
			return {x_axis : cat, data : stat_data};
		},
		build_bar_data : function(stats){
			var x_axis = [];
			var data = [];
			stats.forEach(function(stat){
				x_axis.push(stat.article.title);
				var count = 0;
				stat.statistics.forEach(function(statistic){
					count = count + statistic.viewCount;
				});
				data.push(count);
			});
			return {x_axis : x_axis, data : data};
		},
		navigate : function(selection){
			if (selection.name === dashboard.home_pie_name){
				//line charts
				var stats = dashboard.build_line_data(data.statistics);
				var line_data = [{name : dashboard.home_line_name, data : stats.data}];
				$('#home-container').lineChart(line_data, stats.x_axis, "Nombre d'accès à la page d'accueil", dashboard.title_view);
			}else if(selection.name === dashboard.articles_pie_name){
				dashboard.init_articles();
			}else if(pie_rubriques.indexOf(selection.name) > -1 ){
				rubriques_data.forEach(function(article_data){
					if(selection.name === article_data.rubrique.rubrique){
						articles_data = article_data.articles;
						var stats = dashboard.build_bar_data(article_data.articles, dashboard.title_view);
						$('#home-container').barChart(stats.x_axis, stats.data,article_data.rubrique.rubrique, function(selection){
							dashboard.navigate(selection);
						} , "Nombre de vues des articles de la rubrique " + article_data.rubrique.rubrique, dashboard.title_view);
					}
				});
			}else {
				articles_data.forEach(function(article_data){
					if(selection.category === article_data.article.title){
						var stats = dashboard.build_line_data(article_data.statistics);
						var line_data = [{name : article_data.article.title, data : stats.data}];
						$('#home-container').lineChart(line_data, stats.x_axis, dashboard.title_view, dashboard.title_view);
					}
				});
			}
			console.log(selection.name);
		},
		init_home : function() {
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
				dashboard.data = result;
				//pie chart
				var pie_data = [[dashboard.home_pie_name, result.homeViews], [dashboard.articles_pie_name, result.articleViews]];
				$('#home-container').pieChart(pie_data, "Nombre d'accès au site", dashboard.title_view, function(selection){
					dashboard.navigate(selection);
				});
			});
		},
		init_articles : function(){
			$.getJSON("/rest/statistic/articles", function(result) {
				result.sort(function(a,b){
					if (a.article.rubrique.id > b.article.rubrique.id) {
					    return 1;
					  }
					  if (a.article.rubrique.id < b.article.rubrique.id) {
					    return -1;
					  }
					  return 0;
				});
				var data = [];
				var rubrique = result[0].article.rubrique;
				var articles = [];
				var count = 0;
				result.forEach(function(res){
					if (res.article.rubrique.id === rubrique.id){
						articles.push({article : res.article, statistics : res.statistics});
						res.statistics.forEach(function(stat){
							count = count + stat.viewCount;
						});
					}else{
						data.push({rubrique : rubrique, articles : articles, viewCount : count});
						rubrique = res.article.rubrique;
						articles = [];
						articles.push(res);
						count = 0;
						res.statistics.forEach(function(stat){
							count = count + stat.viewCount;
						});
					}
				});
				data.push({rubrique : rubrique, articles : articles, viewCount : count});
				dashboard.set_rubriques_data(data);
				var pie_data = [];
				
				data.forEach(function(stat){
					pie_data.push([stat.rubrique.rubrique, stat.viewCount]);
					dashboard.add_pie_rubrique(stat.rubrique.rubrique);
				});
				$('#home-container').pieChart(pie_data, "Nombre d'accès aux articles", dashboard.title_view, function(selection){
					dashboard.navigate(selection);
				});
			});
		},
		add_pie_rubrique : function(rubrique){
			pie_rubriques.push(rubrique);
		},
		home_pie_name : "Page d'accueil",
		home_line_name : "Accueil",
		articles_pie_name : "Articles",
		title_view : "Nombre de vues (non unique)"
	}
}());
