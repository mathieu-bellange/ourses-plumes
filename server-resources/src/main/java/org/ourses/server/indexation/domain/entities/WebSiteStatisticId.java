package org.ourses.server.indexation.domain.entities;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Embeddable;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Embeddable
public class WebSiteStatisticId implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String page;
	@Temporal(TemporalType.DATE)
	private Date countDay;
	
	public WebSiteStatisticId(){
		this(null, null);
	}
	
	public WebSiteStatisticId(String page, Date countDay) {
		this.page = page;
		this.countDay = countDay;
	}
	
	public String getPage() {
		return page;
	}
	public void setPage(String page) {
		this.page = page;
	}
	public Date getCountDay() {
		return countDay;
	}
	public void setCountDay(Date countDay) {
		this.countDay = countDay;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((countDay == null) ? 0 : countDay.hashCode());
		result = prime * result + ((page == null) ? 0 : page.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		WebSiteStatisticId other = (WebSiteStatisticId) obj;
		if (countDay == null) {
			if (other.countDay != null)
				return false;
		} else if (!countDay.equals(other.countDay))
			return false;
		if (page == null) {
			if (other.page != null)
				return false;
		} else if (!page.equals(other.page))
			return false;
		return true;
	}

}
