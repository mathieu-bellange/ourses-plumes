package org.ourses.server.redaction.domain.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.springframework.beans.BeanUtils;

import com.avaje.ebean.Ebean;

@Entity
public class Rubrique implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -5279390634966391625L;

    @Id
    @GeneratedValue
    private Long id;
    private String rubrique;

    public Rubrique() {
        this(null, null);
    }

    public Rubrique(Long id, String rubrique) {
        super();
        this.id = id;
        this.rubrique = rubrique;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRubrique() {
        return rubrique;
    }

    public void setRubrique(String rubrique) {
        this.rubrique = rubrique;
    }

    public static Set<Rubrique> findAllRubrique() {
        return Ebean.find(Rubrique.class).findSet();
    }

    public RubriqueDTO toRubriqueDTO() {
        RubriqueDTO rubrique = new RubriqueDTO();
        BeanUtils.copyProperties(this, rubrique);
        return rubrique;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    /*
     * une rubrique ne peut pas être présent deux fois en base donc le hash code et le equals ne tiennent compte que de
     * rubrique
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
