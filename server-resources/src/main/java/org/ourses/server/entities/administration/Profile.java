package org.ourses.server.entities.administration;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Component
@Scope(value=ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Profile {
	protected static final String DEFAULT_PSEUDO = "Ourse à plumes";
	
	@Id
	@GeneratedValue
	private Long id;
	private String pseudo;
	
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
	
}
