package org.ourses.server.external.domain.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class GithubBug {
	
	public GithubBug(){
		this(null,null);
	}
	
	public GithubBug(String title, String body) {
		super();
		this.title = title;
		this.body = body;
	}
	
	private String title;
	
	private String body;
	
	@JsonProperty("title")
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	@JsonProperty("body")
	public String getBody() {
		return body;
	}
	
	public void setBody(String body) {
		this.body = body;
	}

}
