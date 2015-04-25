package org.ourses.server.administration.domain.dto;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.administration.domain.entities.SocialLink;
import org.springframework.beans.BeanUtils;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SocialLinkDTO {

    @JsonProperty("network")
    private String network;
    @JsonProperty("socialUser")
    private String socialUser;
    @JsonProperty("path")
    private String path;
    @JsonProperty("description")
    private String description;

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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
