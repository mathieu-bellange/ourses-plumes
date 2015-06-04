jQuery.fn.extend({
	pieChart : function(pieData, pieTitle, dataName,donutDataName,donutData, onClick){
		$(this).highcharts({
			chart: {
				type : 'pie',
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
				name: dataName,
				data: pieData,
				size: '60%',
	            dataLabels: {
	                color: 'white',
	                distance: -30
	            },
				point:{
	                  events: {
	                      click: function(event){
	                    	  onClick(this);
	                      }
	                  }
	            }
			},{
				name: donutDataName,
	            data: donutData,
	            size: '80%',
	            innerSize: '60%',
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
				enabled : false
			},
			series: lineData
		})
	},
	
	barChart : function(x_axis, barData, dataName, internalBarData, internalBarDataName, onClick, title, y_title){
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
	        legend: {
	            reversed: true
	        },
	        plotOptions: {
	            bar: {
	                dataLabels: {
	                    enabled: true
	                }
	            },
	            series: {
	                stacking: 'normal'
	            }
	        },
	        tooltip: {
	            backgroundColor: 'white',
	            borderWidth: 0,
	            borderRadius: 0,
	            headerFormat: '{point.key} ',
	            pointFormat: ' | <span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>',
	            positioner: function () {
	                return { x: 10, y: 35 };
	            },
	            shadow: false
	        },
	        series: [{
						name: dataName,
						data: barData,
						point:{
			                  events: {
			                      click: function(event){
			                    	  onClick(this);
			                      }
			                  }
			              }
					},
					{
						data : internalBarData,
						name : internalBarDataName,
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
			dashboard.init_component();
			dashboard.init_home();
		}
	}
}());


var dashboard = (function(){
	var data;
	var rubriques_data;
	var articles_data;
	var pie_rubriques = [];
	var current_view;
	var current_rubrique;
	var external_user = "Visiteur extérieur";
	var internal_user = "Visite du site web";
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
			var stat_internal_data = [];
			
			if (stats[0]){
				
				var firstDay = new Date(stats[0].countDay);
				var nextMonth = new Date(firstDay.getTime());
				nextMonth.setDate(nextMonth.getDate() + 30);
				//on affiche les données que sur 1 mois
				if (nextMonth.getTime() >= new Date().getTime()){
					var max_index = new Date().getDate() - firstDay.getDate() + 1;
					var index_stat = 0;
					while(firstDay.getTime() < new Date().getTime()){
						var countDayView = 0;
						var countDayInternalView = 0;
						if(index_stat < stats.length && firstDay.getTime() === new Date(stats[index_stat].countDay).getTime()){
							countDayView = stats[index_stat].viewCount;
							countDayInternalView = stats[index_stat].viewInternalCount;
							index_stat = index_stat + 1;
						}
						cat.push(dayOfMonthToString(firstDay));
						stat_data.push(countDayView - countDayInternalView);
						stat_internal_data.push(countDayInternalView);
						//incrémente d'une journée
						firstDay.setDate(firstDay.getDate() + 1);
					}
				}
				//on affiche les données sur plusieurs mois
				else{
					var countOfMonth = 0;
					var countInternalOfMonth = 0;
					var month = firstDay;
					stats.forEach(function(stat, index){
						if (new Date(stat.countDay).getMonth() === month.getMonth()){
							countOfMonth = countOfMonth + stat.viewCount;
							countInternalOfMonth = countInternalOfMonth + stat.viewInternalCount;
							if (index === stats.length - 1){
								cat.push(monthOfYearToString(month));
								stat_data.push(stat.viewCount - stat.viewInternalCount);
								stat_internal_data.push(stat.viewInternalCount);
							}
						}else{
							cat.push(monthOfYearToString(month));
							stat_data.push(countOfMonth - countInternalOfMonth);
							stat_internal_data.push(countInternalOfMonth);
							month = new Date(month.setMonth(month.getMonth() + 1));
							countOfMonth = 0;
							countInternalOfMonth = 0;
						}
					});
				}
			}
			return {x_axis : cat, data : stat_data, internal_data : stat_internal_data};
		},
		build_bar_data : function(stats){
			var x_axis = [];
			var data = [];
			var internal_data = [];
			stats.forEach(function(stat){
				x_axis.push(stat.article.title);
				var count = 0;
				var internal_count = 0;
				stat.statistics.forEach(function(statistic){
					internal_count = internal_count + statistic.viewInternalCount;
					count = count + statistic.viewCount;
				});
				internal_data.push(internal_count);
				data.push(count - internal_count);
			});
			return {x_axis : x_axis, data : data, internal_data : internal_data};
		},
		navigate : function(selection){
			if(selection === dashboard.home_pie_name){
				current_view = selection;
				$("#dashboard a").addClass("hide");
				dashboard.init_home();
			}else if (selection === dashboard.articles_pie_name){
				current_view = selection;
				dashboard.init_articles();
				$("#dashboard a").removeClass("hide");
			}else if (selection === dashboard.home_line_name){
				current_view = selection;
				//line charts
				var stats = dashboard.build_line_data(data.statistics);
				var line_data = [{name : external_user, data : stats.data}, {name : internal_user, data : stats.internal_data}];
				$('#home-container').lineChart(line_data, stats.x_axis, "Nombre d'accès à la page d'accueil", dashboard.title_view);
				$("#dashboard a").removeClass("hide");
			}else if(pie_rubriques.indexOf(selection) > -1 ){
				current_view = selection;
				current_rubrique = selection;
				rubriques_data.forEach(function(article_data){
					if(selection === article_data.rubrique.rubrique){
						articles_data = article_data.articles;
						var stats = dashboard.build_bar_data(article_data.articles, dashboard.title_view);
						$('#home-container').barChart(stats.x_axis, stats.data, external_user, stats.internal_data, internal_user, function(selection){
							dashboard.navigate(selection.category);
						} , "Nombre de vues des articles de la rubrique " + article_data.rubrique.rubrique, dashboard.title_view);
					}
				});
				$("#dashboard a").removeClass("hide");
			}else {
				current_view = selection;
				articles_data.forEach(function(article_data){
					if(selection === article_data.article.title){
						var stats = dashboard.build_line_data(article_data.statistics);
						var line_data = [{name : external_user, data : stats.data}, {name : internal_user, data : stats.internal_data}];
						$('#home-container').lineChart(line_data, stats.x_axis, selection, dashboard.title_view);
					}
				});
				$("#dashboard a").removeClass("hide");
			}
		},
		init_component : function(){
			$("#back").on("click", function(){
				if (current_view === dashboard.articles_pie_name){
					dashboard.navigate(dashboard.home_pie_name);
				}else if (current_view === dashboard.home_line_name){
					dashboard.navigate(dashboard.home_pie_name);
				}else if(pie_rubriques.indexOf(current_view) > -1 ){
					dashboard.navigate(dashboard.articles_pie_name);
				}else{
					dashboard.navigate(current_rubrique);
				}
			});
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
				data = result;
				//pie chart
				var colors = Highcharts.getOptions().colors;
				var pie_data = [{
									name : dashboard.home_pie_name, 
									y : result.homeViews, 
									color : colors[0],
									category : dashboard.home_line_name
								},
								{
									name : dashboard.articles_pie_name, 
									y : result.articleViews,
									color : colors[1],
									category : dashboard.articles_pie_name
								}];
				var home_external_views = result.homeViews - result.homeInternalViews;
				var article_external_views = result.articleViews - result.articleInternalViews;
				var donut_data = [{
									  name : external_user, 
									  y : home_external_views,
									  color : Highcharts.Color(colors[0]).brighten(home_external_views/result.homeViews/5).get(),
									  category : dashboard.home_line_name
								  },
								  {
									  name : internal_user, 
									  y : result.homeInternalViews,
									  color : Highcharts.Color(colors[0]).brighten(result.homeInternalViews/result.homeViews/5).get(),
									  category : dashboard.home_line_name
								  },
								  {
									  name : external_user, 
									  y : article_external_views,
									  color : Highcharts.Color(colors[1]).brighten(article_external_views/result.articleViews/5).get(),
									  category : dashboard.articles_pie_name
								  },
								  {
									  name : internal_user, 
									  y : result.articleInternalViews,
									  color : Highcharts.Color(colors[1]).brighten(result.articleInternalViews/result.articleViews/5).get(),
									  category : dashboard.articles_pie_name
								  }];
				$('#home-container').pieChart(pie_data, "Nombre d'accès au site", dashboard.title_view, dashboard.title_view,donut_data, function(selection){
					dashboard.navigate(selection.category);
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
				var internal_count = 0;
				result.forEach(function(res){
					if (res.article.rubrique.id === rubrique.id){
						articles.push({article : res.article, statistics : res.statistics});
						res.statistics.forEach(function(stat){
							count = count + stat.viewCount;
							internal_count = internal_count + stat.viewInternalCount;
						});
					}else{
						data.push({rubrique : rubrique, articles : articles, viewCount : count, viewInternalCount : internal_count});
						rubrique = res.article.rubrique;
						articles = [];
						articles.push(res);
						count = 0;
						internal_count = 0;
						res.statistics.forEach(function(stat){
							count = count + stat.viewCount;
							internal_count = internal_count + stat.viewInternalCount;
						});
					}
				});
				data.push({rubrique : rubrique, articles : articles, viewCount : count, viewInternalCount : internal_count});
				dashboard.set_rubriques_data(data);
				var pie_data = [];
				var donut_data = [];
				var colors = Highcharts.getOptions().colors;
				var index = 0;
				data.forEach(function(stat){
					pie_data.push({
									name : stat.rubrique.rubrique, 
									y : stat.viewCount,
									color : colors[index],
									category : stat.rubrique.rubrique
								});
					donut_data.push({
						name : external_user, 
						y : stat.viewCount - stat.viewInternalCount,
						color : colors[index],
						category : stat.rubrique.rubrique
					});
					donut_data.push({
						name : internal_user, 
						y : stat.viewInternalCount,
						color : colors[index],
						category : stat.rubrique.rubrique
					});
					dashboard.add_pie_rubrique(stat.rubrique.rubrique);
					index += 1;
				});
				$('#home-container').pieChart(pie_data, "Nombre d'accès aux articles", dashboard.title_view,dashboard.title_view,donut_data, function(selection){
					dashboard.navigate(selection.category);
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
