package org.ourses.server.administration.domain.entities;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Version;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.dto.SocialLinkDTO;
import org.ourses.server.picture.domain.dto.AvatarDTO;
import org.ourses.server.picture.domain.entities.Avatar;
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

    public static final String PSEUDO = "pseudo";
    public static final String PATH = "path";
    public static final String PSEUDO_BEAUTIFY = "pseudoBeautify";
    @Id
    @GeneratedValue
    private Long id;
    private String pseudo;
    private String description;
    private String path;
    private String pseudoBeautify;

    @OneToOne(cascade = CascadeType.REMOVE)
    @Column(name = "avatar_id")
    private Avatar avatar;
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

    public Avatar getAvatar() {
        return avatar;
    }

    public void setAvatar(Avatar avatar) {
        this.avatar = avatar;
    }

    public Set<SocialLink> getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(Set<SocialLink> socialLinks) {
        this.socialLinks = socialLinks;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getPseudoBeautify() {
        return pseudoBeautify;
    }

    public void setPseudoBeautify(String pseudoBeautify) {
        this.pseudoBeautify = pseudoBeautify;
    }

    public String getPath() {
        return path;
    }

    public ProfileDTO toProfileDTO() {
        ProfileDTO profile = new ProfileDTO();
        BeanUtils.copyProperties(this, profile, new String[] { "socialLinks", "avatar" });
        if (socialLinks != null) {
            for (SocialLink link : socialLinks) {
                SocialLinkDTO linkDTO = new SocialLinkDTO();
                BeanUtils.copyProperties(link, linkDTO);
                profile.getSocialLinks().add(linkDTO);
            }
        }
        if (avatar != null) {
            AvatarDTO avatar = new AvatarDTO();
            BeanUtils.copyProperties(getAvatar(), avatar);
            profile.setAvatar(avatar);
        }
        return profile;
    }

    public static Profile findPublicProfile(Long id) {
        return Ebean.find(Profile.class).fetch("socialLinks").fetch("avatar", "path").setId(id).findUnique();
    }

    public static Profile findPublicProfile(String pseudoBeautify) {
        return Ebean.find(Profile.class).fetch("socialLinks").fetch("avatar", "path").where()
                .eq("pseudoBeautify", pseudoBeautify).findUnique();
    }

    public static int countPseudo(String pseudoBeautify) {
        return Ebean.find(Profile.class).where().eq("pseudoBeautify", pseudoBeautify).findRowCount();
    }

    public static int countPseudo(String pseudoBeautify, Long profileId) {
        return Ebean.find(Profile.class).where().eq("pseudoBeautify", pseudoBeautify).ne("id", profileId)
                .findRowCount();
    }

    public void updateProfileProperty(String... propertiesToUpdate) {
        Ebean.update(this, Sets.newHashSet(propertiesToUpdate));
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
