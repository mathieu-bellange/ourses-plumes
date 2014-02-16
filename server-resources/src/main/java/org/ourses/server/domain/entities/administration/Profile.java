package org.ourses.server.domain.entities.administration;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import org.ourses.server.domain.jsondto.administration.ProfileDTO;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Profile {
    protected static final String DEFAULT_PSEUDO = "Ourse à plumes";

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
        this.pseudo = DEFAULT_PSEUDO;
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
}
