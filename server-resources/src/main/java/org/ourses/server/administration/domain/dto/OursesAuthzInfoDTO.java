package org.ourses.server.administration.domain.dto;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.administration.domain.entities.OursesAuthorizationInfo;

public class OursesAuthzInfoDTO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("role")
    private String role;

    public OursesAuthzInfoDTO() {
        super();
    }

    public OursesAuthzInfoDTO(String role) {
        this(null, role);
    }

    public OursesAuthzInfoDTO(Long id, String role) {
        this.id = id;
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OursesAuthorizationInfo toOursesAuthorizationInfo() {
        OursesAuthorizationInfo oursesAuthorizationInfo = new OursesAuthorizationInfo(this.id, this.role);
        return oursesAuthorizationInfo;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    /*
     * une authorizationInfo ne peut pas être présente deux fois en base donc le hash code et le equals ne tiennent
     * compte que de authorizationInfo
     */

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this, "id");
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj, "id");
    }

}
