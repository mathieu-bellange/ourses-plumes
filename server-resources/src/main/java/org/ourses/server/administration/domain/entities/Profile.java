package org.ourses.server.administration.domain.entities;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Version;

import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.dto.SocialLinkDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;
import com.google.common.collect.Sets;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Profile {

    @Id
    @GeneratedValue
    private Long id;
    private String pseudo;

    private String description;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id")
    private Set<SocialLink> socialLinks;

    @Version
    private Integer version;

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Profile() {
    }

    public Profile(Long id, String pseudo, String description) {
        this.id = id;
        this.pseudo = pseudo;
        this.description = description;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<SocialLink> getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(Set<SocialLink> socialLinks) {
        this.socialLinks = socialLinks;
    }

    public ProfileDTO toProfileDTO() {
        ProfileDTO profile = new ProfileDTO();
        BeanUtils.copyProperties(this, profile, new String[] { "socialLinks" });
        Set<SocialLinkDTO> links = Sets.newHashSet();
        if (socialLinks != null) {
            for (SocialLink link : socialLinks) {
                SocialLinkDTO linkDTO = new SocialLinkDTO();
                BeanUtils.copyProperties(link, linkDTO);
                links.add(linkDTO);
            }
            profile.setSocialLinks(links);
        }
        return profile;
    }

    public static Profile findProfileWithSocialLinks(Long id) {
        return Ebean.find(Profile.class).fetch("socialLinks").setId(id).findUnique();
    }

    public static int countPseudo(String pseudo) {
        return Ebean.find(Profile.class).where().eq("pseudo", pseudo).findRowCount();
    }
}
