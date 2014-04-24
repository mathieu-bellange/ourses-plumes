package org.ourses.server.security.domain.dto;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.codehaus.jackson.annotate.JsonProperty;

public class LoginDTO {

	private String mail;
	private String password;

	public LoginDTO() {

	}

	public LoginDTO(String mail, String password) {
		this.mail = mail;
		this.password = password;
	}

	@JsonProperty("password")
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@JsonProperty("login")
	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this,
				ToStringStyle.MULTI_LINE_STYLE);
	}

	@Override
	public int hashCode() {
		return HashCodeBuilder.reflectionHashCode(this, true);
	}

	@Override
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj, true);
	}
	
	public UsernamePasswordToken toAuthcToken(){
		return new UsernamePasswordToken(this.mail, this.password, false);
	}

}
