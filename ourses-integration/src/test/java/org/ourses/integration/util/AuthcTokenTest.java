package org.ourses.integration.util;

import java.util.Date;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class AuthcTokenTest {
	
	private String token;
	private Date expirationDate;

	public AuthcTokenTest() {

	}
	public AuthcTokenTest(String token, Date expirationDate) {
		this.token = token;
		this.expirationDate = expirationDate;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

}
