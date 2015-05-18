package org.ourses.server.indexation.domain.entities;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;

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
}
