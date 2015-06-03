package org.ourses.server.indexation.domain.dto;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class HomePageStatisticDTO {

	private int homeViews;
	private int articleViews;
	
	private Collection<WebSiteStatisticDTO> statistics;
	private int articleInternalViews;
	private int homeInternalViews;

	public int getHomeViews() {
		return homeViews;
	}

	public void setHomeViews(int homeViews) {
		this.homeViews = homeViews;
	}

	public int getArticleViews() {
		return articleViews;
	}

	public void setArticleViews(int articleViews) {
		this.articleViews = articleViews;
	}

	public Collection<WebSiteStatisticDTO> getStatistics() {
		return statistics;
	}

	public void setStatistics(Collection<WebSiteStatisticDTO> statistics) {
		this.statistics = statistics;
	}

	public void setArticleInternalViews(int articleInternalView) {
		this.articleInternalViews = articleInternalView;
	}

	public void setHomeInternalViews(int homeInternalView) {
		this.homeInternalViews = homeInternalView;
	}

	public int getArticleInternalViews() {
		return articleInternalViews;
	}

	public int getHomeInternalViews() {
		return homeInternalViews;
	}
	
	
}
