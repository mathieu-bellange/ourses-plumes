package org.ourses.server.indexation.domain.dto;

import java.util.Date;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WebSiteStatisticDTO {

	private String page;
	private Date countDay;
	private int viewCount;
	private int viewInternalCount;
	
	public WebSiteStatisticDTO(String page, Date countDay, int viewCount, int viewInternalCount) {
		this.page = page;
		this.countDay = countDay;
		this.viewCount = viewCount;
		this.viewInternalCount = viewInternalCount;
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
	public int getViewCount() {
		return viewCount;
	}
	public void setViewCount(int viewCount) {
		this.viewCount = viewCount;
	}
	
	public int getViewInternalCount() {
		return viewInternalCount;
	}
	public void setViewInternalCount(int viewInternalCount) {
		this.viewInternalCount = viewInternalCount;
	}
	@Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
	
}
