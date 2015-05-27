package org.ourses.server.indexation.helpers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.ourses.server.indexation.domain.dto.ArticlePageStatisticDTO;
import org.ourses.server.indexation.domain.dto.HomePageStatisticDTO;
import org.ourses.server.indexation.domain.dto.WebSiteStatisticDTO;
import org.ourses.server.indexation.domain.entities.WebSiteStatistic;
import org.ourses.server.indexation.domain.entities.WebSiteStatisticId;
import org.ourses.server.redaction.domain.entities.Article;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;

@Component
@EnableAsync
public class StatisticsHelperImpl implements StatisticsHelper {

	DateTimeFormatter countDayFormatter = DateTimeFormat.forPattern("yyyy-MM-dd").withLocale(Locale.FRANCE);

	public StatisticsHelperImpl(){
	}

	@Override
	@Async
	public void countView(String requestUri) {
		if ("/".equals(requestUri) || requestUri.matches("^/articles/(.*)/([0-9]*)/(.*)$")){
			WebSiteStatisticId id = new WebSiteStatisticId(requestUri, DateTime.parse(DateTime.now().toString(countDayFormatter)).toDate());
			WebSiteStatistic dayStat = WebSiteStatistic.findById(id);
			if (dayStat != null){
				dayStat.addCount();
			}else{
				dayStat = new WebSiteStatistic();
				dayStat.setId(id);
				dayStat.setViewCount(1);
				dayStat.save();
			}
		}
	}

	@Override
	public HomePageStatisticDTO findHomePageStatistic() {
		Collection<? extends WebSiteStatistic> stats = WebSiteStatistic.findAllStats();
		int homeViews = 0;
		int articleViews = 0;
		List<WebSiteStatisticDTO> dto = new ArrayList<WebSiteStatisticDTO>();
		for (WebSiteStatistic stat : stats){
			if (stat.getId().getPage().equals("/")){
				dto.add(stat.toWebSiteStatisticDTO());
				homeViews = homeViews + stat.getViewCount();
			}else if(stat.getId().getPage().matches("^/articles/(.*)/([0-9]*)/(.*)$")){
				articleViews = articleViews + stat.getViewCount();
			}
		}
		HomePageStatisticDTO homeStats = new HomePageStatisticDTO();
		homeStats.setArticleViews(articleViews);
		homeStats.setHomeViews(homeViews);
		homeStats.setStatistics(dto);
		return homeStats;
	}

	@Override
	public Collection<? extends ArticlePageStatisticDTO> findArticlePageStatistic() {
		Collection<? extends Article> articles = Article.findOnline();
		List<ArticlePageStatisticDTO> pages = Lists.newArrayList();
		for(Article art : articles){
			ArticlePageStatisticDTO artStat = new ArticlePageStatisticDTO();
			artStat.setArticle(art.toPartialArticleDTO());
			Collection<? extends WebSiteStatistic> webSiteStat = WebSiteStatistic.findAllStatsByPage(art.getPath());
			artStat.setStatistics(Lists.newArrayList(Collections2.transform(webSiteStat, new Function<WebSiteStatistic, WebSiteStatisticDTO>() {

				@Override
				public WebSiteStatisticDTO apply(WebSiteStatistic input) {
					return input.toWebSiteStatisticDTO();
				}
			})));
			pages.add(artStat);
		}
		return pages;
	}

}
