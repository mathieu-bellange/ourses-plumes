package org.ourses.server.external.domain.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class BitlyUrl {

	@JsonProperty("status_code")
	private String statusCode;
	private BitlyData data;
	
	public String getStatusCode() {
		return statusCode;
	}


	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}


	public BitlyData getData() {
		return data;
	}


	public void setData(BitlyData data) {
		this.data = data;
	}

	@JsonIgnoreProperties(ignoreUnknown=true)
	public class BitlyData{
		
		private String url;

		public String getUrl() {
			return url;
		}

		public void setUrl(String url) {
			this.url = url;
		}
		
		
	}
}
