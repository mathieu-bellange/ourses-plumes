package org.ourses.server.administration.domain.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.administration.domain.dto.SocialLinkDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class SocialLink {

    @Id
    @GeneratedValue
    private Long id;
    private String network;
    @Column(name = "social_user")
    private String socialUser;

    public SocialLink() {

    }

    public SocialLink(Long id, String network, String socialUser) {
        this.id = id;
        this.network = network;
        this.socialUser = socialUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public SocialLinkDTO toSocialLinkDTO() {
        SocialLinkDTO socialLink = new SocialLinkDTO();
        BeanUtils.copyProperties(this, socialLink);
        return socialLink;

    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
