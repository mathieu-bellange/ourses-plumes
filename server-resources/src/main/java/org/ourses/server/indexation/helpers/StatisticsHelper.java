package org.ourses.server.indexation.helpers;

import java.util.Collection;

import org.ourses.server.indexation.domain.dto.ArticlePageStatisticDTO;
import org.ourses.server.indexation.domain.dto.ArticlesStatisticDTO;
import org.ourses.server.indexation.domain.dto.HomePageStatisticDTO;


public interface StatisticsHelper {

	void countView(String requestUri);

	HomePageStatisticDTO findHomePageStatistic();

	Collection<? extends ArticlePageStatisticDTO> findArticlePageStatistic();

	void addWebStatistic(String path);
	
}
