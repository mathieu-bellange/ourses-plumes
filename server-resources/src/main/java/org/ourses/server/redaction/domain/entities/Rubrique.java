package org.ourses.server.redaction.domain.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

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
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "rubrique_seq_gen")
    @SequenceGenerator(name = "rubrique_seq_gen", sequenceName = "rubrique_seq")
    private Long id;
    private String rubrique;
    private String classe;
    private String path;

    public Rubrique() {
        this(null, null, null);
    }

    public Rubrique(Long id, String rubrique, String path) {
        super();
        this.id = id;
        this.rubrique = rubrique;
        this.path = path;
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

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
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

    public String getClasse() {
        return classe;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

}
