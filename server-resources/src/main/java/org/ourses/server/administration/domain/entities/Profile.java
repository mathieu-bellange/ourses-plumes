package org.ourses.server.administration.domain.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Profile {

    @Id
    @GeneratedValue
    private Long id;
    private String pseudo;

    private String description;

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

    public ProfileDTO toProfileDTO() {
        return new ProfileDTO(pseudo, description, version);
    }

    public static int countPseudo(String pseudo) {
        return Ebean.find(Profile.class).where().eq("pseudo", pseudo).findRowCount();
    }
}
