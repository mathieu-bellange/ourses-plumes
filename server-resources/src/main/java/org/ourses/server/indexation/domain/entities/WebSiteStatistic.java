package org.ourses.server.indexation.domain.entities;

import java.util.Collection;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;

import org.ourses.server.indexation.domain.dto.WebSiteStatisticDTO;

import com.avaje.ebean.Ebean;
import com.google.common.collect.Sets;

@Entity
public class WebSiteStatistic {
	
	@EmbeddedId
	private WebSiteStatisticId id;
	private int viewCount;
	
	public WebSiteStatisticId getId() {
		return id;
	}
	
	public void setId(WebSiteStatisticId id) {
		this.id = id;
	}
	
	public int getViewCount() {
		return viewCount;
	}
	
	public void setViewCount(int count) {
		this.viewCount = count;
	}
	
	public static WebSiteStatistic findById(WebSiteStatisticId id){
		return Ebean.find(WebSiteStatistic.class, (WebSiteStatisticId)id);
	}

	public void addCount() {
		viewCount = viewCount + 1;
		Ebean.update(this, Sets.newHashSet("viewCount"));
	}

	public void save() {
		Ebean.save(this);
	}

	public static Collection<? extends WebSiteStatistic> findAllStatsByPage(String page) {
		return Ebean.find(WebSiteStatistic.class).where().eq("id.page", page).findSet();
		
	}

	public WebSiteStatisticDTO toWebSiteStatisticDTO() {
		return new WebSiteStatisticDTO(id.getPage(),id.getCountDay(), viewCount);
	}

	public static Collection<? extends WebSiteStatistic> findAllStats() {
		return Ebean.find(WebSiteStatistic.class).findSet();
	}

	public static Collection<? extends WebSiteStatistic> findArticlesStats() {
		return Ebean.find(WebSiteStatistic.class).where().ne("id.page", "/").orderBy().asc("id.countDay").findList();
	}

}
