package org.ourses.server.redaction.domain.dto;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.redaction.domain.entities.Rubrique;
import org.springframework.beans.BeanUtils;

public class RubriqueDTO {

    private Long id;
    private String classe;
    private String path;

    public RubriqueDTO() {
    }

    public RubriqueDTO(Long id, String rubrique) {
        this.id = id;
        this.rubrique = rubrique;
    }

    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private String rubrique;

    @JsonProperty("rubrique")
    public String getRubrique() {
        return rubrique;
    }

    public void setRubrique(String rubrique) {
        this.rubrique = rubrique;
    }

    @JsonProperty("path")
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Rubrique toRubrique() {
        Rubrique rubrique = new Rubrique();
        BeanUtils.copyProperties(this, rubrique);
        return rubrique;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this, "id");
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj, "id");
    }

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }
}
