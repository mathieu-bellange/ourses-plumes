package org.ourses.server.domain.jsondto.administration;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.domain.entities.administration.Profile;
import org.springframework.beans.BeanUtils;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ProfileDTO {

    private String description;
    private String pseudo;
	private Integer version;

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
    
    public void setVersion(Integer version) {
		this.version = version;
	}
	
    @JsonProperty("version")
	public Integer getVersion() {
		return version;
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

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this, true);
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj, true);
    }
}