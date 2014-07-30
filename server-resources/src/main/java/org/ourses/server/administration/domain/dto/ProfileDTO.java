package org.ourses.server.administration.domain.dto;

import java.util.Set;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.util.SocialLinkUtil;
import org.springframework.beans.BeanUtils;

import com.google.common.collect.Sets;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProfileDTO {

    private String description;
    private String pseudo;
    private String path;
    private String pseudoBeautify;
    private Integer version;
    private Set<SocialLinkDTO> socialLinks = Sets.newTreeSet(SocialLinkUtil.NETWORK_COMPARATOR);

    public ProfileDTO() {

    }

    public ProfileDTO(String pseudo, String description, Integer version) {
        this.pseudo = pseudo;
        this.description = description;
        this.version = version;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @JsonProperty("pseudo")
    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    @JsonProperty("path")
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @JsonProperty("pseudoBeautify")
    public String getPseudoBeautify() {
        return pseudoBeautify;
    }

    public void setPseudoBeautify(String pseudoBeautify) {
        this.pseudoBeautify = pseudoBeautify;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    @JsonProperty("version")
    public Integer getVersion() {
        return version;
    }

    public Set<SocialLinkDTO> getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(Set<SocialLinkDTO> socialLinks) {
        this.socialLinks = socialLinks;
    }

    public Profile toProfile() {
        Profile profile = new Profile();
        BeanUtils.copyProperties(this, profile);
        return profile;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
