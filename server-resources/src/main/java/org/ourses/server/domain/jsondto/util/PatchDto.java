package org.ourses.server.domain.jsondto.util;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PatchDto {

    public PatchDto() {

    }

    @JsonProperty("property")
    private String property;

    @JsonProperty("newValue")
    private String newValue;

    public String getProperties() {
        return property;
    }

    public void setProperties(String properties) {
        this.property = properties;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    /*
     * un patch dto se base sur la property
     */

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this, "property");
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj, "property");
    }

}
