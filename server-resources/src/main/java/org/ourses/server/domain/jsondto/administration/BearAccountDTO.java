package org.ourses.server.domain.jsondto.administration;

import java.util.Set;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.domain.entities.administration.BearAccount;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BearAccountDTO {

    private String mail;
    private String password;
    private Set<String> roles;
    private ProfileDTO profile;

    public BearAccountDTO() {

    }

    public BearAccountDTO(String mail, String password, Set<String> roles, ProfileDTO profile) {
        this.mail = mail;
        this.password = password;
        this.roles = roles;
        this.profile = profile;
    }

    @JsonProperty("password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @JsonProperty("roles")
    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    @JsonProperty("mail")
    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    @JsonProperty("profile")
    public ProfileDTO getProfile() {
        return profile;
    }

    public void setProfile(ProfileDTO profileDTO) {
        this.profile = profileDTO;
    }

    public BearAccount toBearAccount() {
        return new BearAccount(mail, password, roles, profile.toProfile());
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
