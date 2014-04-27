package org.ourses.server.security.domain.dto;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonProperty;

public class AuthenticatedUserDTO {

	@JsonProperty("token")
	private String token;
	@JsonProperty("pseudo")
	private String pseudo;
	@JsonProperty("role")
	private String role;
	
	public AuthenticatedUserDTO() {

	}
	
	
	public AuthenticatedUserDTO(String token, String pseudo, String role) {
		this.token = token;
		this.pseudo = pseudo;
		this.role = role;
	}
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getPseudo() {
		return pseudo;
	}
	public void setPseudo(String pseudo) {
		this.pseudo = pseudo;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this,
				ToStringStyle.MULTI_LINE_STYLE);
	}
}
