package org.ourses.server.security.domain.dto;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonProperty;

public class AuthenticatedUserDTO {

    @JsonProperty("accountId")
    private Long accountId;
    @JsonProperty("profileId")
    private Long profileId;
    @JsonProperty("token")
    private String token;
    @JsonProperty("pseudo")
    private String pseudo;
    @JsonProperty("role")
    private String role;
    @JsonProperty("avatar")
    private String pathAvatar;

    public AuthenticatedUserDTO() {

    }

    public AuthenticatedUserDTO(Long accountId, Long profileId, String token, String pseudo, String role,
            String pathAvatar) {
        this.profileId = profileId;
        this.accountId = accountId;
        this.token = token;
        this.pseudo = pseudo;
        this.role = role;
        this.pathAvatar = pathAvatar;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPseudo() {
        return pseudo;
    }

    public void setPseudo(String pseudo) {
        this.pseudo = pseudo;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPathAvatar() {
        return pathAvatar;
    }

    public void setPathAvatar(String pathAvatar) {
        this.pathAvatar = pathAvatar;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
}
