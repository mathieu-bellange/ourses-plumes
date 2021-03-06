package org.ourses.server.administration.domain.dto;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.administration.domain.entities.BearAccount;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BearAccountDTO {

    private Long id;
    private String mail;
    private String password;
    private OursesAuthzInfoDTO role;
    private ProfileDTO profile;
    private Integer version;

    public BearAccountDTO() {

    }

    public BearAccountDTO(Long id, String mail, String password, ProfileDTO profile, OursesAuthzInfoDTO role,
            Integer version) {
        this.id = id;
        this.mail = mail;
        this.password = password;
        this.profile = profile;
        this.role = role;
        this.setVersion(version);
    }

    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonProperty("version")
    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    @JsonProperty("password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @JsonProperty("role")
    public OursesAuthzInfoDTO getRole() {
        return role;
    }

    public void setRole(OursesAuthzInfoDTO role) {
        this.role = role;
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
        BearAccount bearAccount = new BearAccount(id, mail, password, profile.toProfile(), version);
        if (role != null) {
            bearAccount.setAuthzInfo(role.toOursesAuthorizationInfo());
        }
        return bearAccount;
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
