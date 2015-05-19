package org.ourses.server.indexation.helpers;

import org.ourses.server.indexation.domain.dto.HomePageStatisticDTO;


public interface StatisticsHelper {

	void countView(String requestUri);

	HomePageStatisticDTO findHomePageStatistic();
	
}
