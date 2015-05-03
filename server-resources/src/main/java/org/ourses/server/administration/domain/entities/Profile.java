package org.ourses.server.administration.domain.entities;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
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
import com.avaje.ebean.Expr;
import com.google.common.collect.Sets;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Profile {

    public static final String PSEUDO = "pseudo";
    public static final String PATH = "path";
    public static final String PSEUDO_BEAUTIFY = "pseudoBeautify";
    private static final Long DEFAULT_ID_PRODILE = 0l;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "profile_seq_gen")
    @SequenceGenerator(name = "profile_seq_gen", sequenceName = "profile_seq")
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
    @OneToOne(mappedBy = "profile")
    private BearAccount account;

    @Version
    private Integer version;

    public Integer getVersion() {
        return version;
    }

    public void setVersion(final Integer version) {
        this.version = version;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public Profile() {
    }

    public Profile(final Long id, final String pseudo, final String description) {
        this.id = id;
        this.pseudo = pseudo;
        this.description = description;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(final String pseudo) {
        this.pseudo = pseudo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public Avatar getAvatar() {
        return avatar;
    }

    public void setAvatar(final Avatar avatar) {
        this.avatar = avatar;
    }

    public Set<SocialLink> getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(final Set<SocialLink> socialLinks) {
        this.socialLinks = socialLinks;
    }

    public BearAccount getAccount() {
        return account;
    }

    public void setAccount(final BearAccount account) {
        this.account = account;
    }

    public void setPath(final String path) {
        this.path = path;
    }

    public String getPseudoBeautify() {
        return pseudoBeautify;
    }

    public void setPseudoBeautify(final String pseudoBeautify) {
        this.pseudoBeautify = pseudoBeautify;
    }

    public String getPath() {
        return path;
    }

    public static Profile findPublicProfile(final Long id) {
        return Ebean.find(Profile.class).fetch("socialLinks").fetch("avatar", "path").setId(id).findUnique();
    }

    public static Profile findPublicProfile(final String pseudoBeautify) {
        return Ebean.find(Profile.class).fetch("socialLinks").fetch("avatar", "path").where()
                .eq("pseudoBeautify", pseudoBeautify).findUnique();
    }

    public static int countPseudo(final String pseudoBeautify) {
        return Ebean.find(Profile.class).where().eq("pseudoBeautify", pseudoBeautify).findRowCount();
    }

    public static int countPseudo(final String pseudoBeautify, final Long profileId) {
        return Ebean.find(Profile.class).where().eq("pseudoBeautify", pseudoBeautify).ne("id", profileId)
                .findRowCount();
    }

    public void updateProfileProperty(final String... propertiesToUpdate) {
        Ebean.update(this, Sets.newHashSet(propertiesToUpdate));
    }

    public static Set<Profile> findWriterProfiles() {
        return Ebean.find(Profile.class).where()
                .or(Expr.eq("account.authzInfo.mainRole", "admin"), Expr.eq("account.authzInfo.mainRole", "writer"))
                .findSet();
    }

    public ProfileDTO toFullProfileDTO() {
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
    
    public ProfileDTO toPartialProfileDTO() {
    	ProfileDTO profile = new ProfileDTO();
        BeanUtils.copyProperties(this, profile, new String[] { "socialLinks", "avatar" });
    	return profile;
	}

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    public static Profile findDefaultWriterProfile() {
        return Ebean.find(Profile.class).where().eq("id", DEFAULT_ID_PRODILE).findUnique();
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((pseudo == null) ? 0 : pseudo.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Profile other = (Profile) obj;
        if (id == null) {
            if (other.id != null) {
                return false;
            }
        }
        else if (!id.equals(other.id)) {
            return false;
        }
        if (pseudo == null) {
            if (other.pseudo != null) {
                return false;
            }
        }
        else if (!pseudo.equals(other.pseudo)) {
            return false;
        }
        return true;
    }
}
