package org.ourses.server.indexation.helpers;

import java.util.Locale;
import java.util.Map;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.ourses.server.indexation.domain.entities.WebSiteStatistic;
import org.ourses.server.indexation.domain.entities.WebSiteStatisticId;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

import com.google.common.collect.Maps;

@Component
@EnableAsync
public class StatisticsHelperImpl implements StatisticsHelper {
	
	Map<String,String> countPages = Maps.newHashMap(); 
	DateTimeFormatter countDayFormatter = DateTimeFormat.forPattern("yyyy-MM-dd").withLocale(Locale.FRANCE);
	
	public StatisticsHelperImpl(){
		countPages.put("/", "home");
	}

	@Override
	@Async
	public void countView(String requestUri) {
		if (countPages.containsKey(requestUri)){
			WebSiteStatisticId id = new WebSiteStatisticId(countPages.get(requestUri), DateTime.parse(DateTime.now().toString(countDayFormatter)).toDate());
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

}
