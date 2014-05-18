package org.ourses.server.administration.domain.dto;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.administration.domain.entities.SocialLink;
import org.springframework.beans.BeanUtils;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SocialLinkDTO {

	@JsonProperty("network")
	private String network;
	@JsonProperty("socialUser")
	private String socialUser;

	public SocialLinkDTO() {
	}

	public SocialLinkDTO(String network, String socialUser) {
		this.network = network;
		this.socialUser = socialUser;
	}

	public String getNetwork() {
		return network;
	}

	public void setNetwork(String network) {
		this.network = network;
	}

	public String getSocialUser() {
		return socialUser;
	}

	public void setSocialUser(String socialUser) {
		this.socialUser = socialUser;
	}
	
	public SocialLink toSocialLink() {
		SocialLink socialLink = new SocialLink();
        BeanUtils.copyProperties(this, socialLink);
        return socialLink;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
