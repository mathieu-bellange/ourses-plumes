package org.ourses.server.indexation.helpers;

import java.util.List;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;

@Component
@EnableAsync
public class StatistiquesHelperImpl implements StatistiquesHelper {
	
	List<String> countPages = Lists.newArrayList("/");
	
	int count;

	@Override
	@Async
	public void countView(String requestUri) {
		if (countPages.contains(requestUri)){
			try {
				Thread.sleep(10000);
				count++;
				System.out.println(count);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

}
