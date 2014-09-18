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
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Category implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = 8551301854355888909L;

    public Category() {

    }

    public Category(Long id, String category) {
        this.id = id;
        this.category = category;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "category_seq_gen")
    @SequenceGenerator(name = "category_seq_gen", sequenceName = "category_seq")
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private String category;

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public static Set<Category> findAllCategory() {
        return Ebean.find(Category.class).findSet();
    }

    public CategoryDTO toCategoryDTO() {
        CategoryDTO category = new CategoryDTO();
        BeanUtils.copyProperties(this, category);
        return category;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

    /*
     * une catégorie ne peut pas être présent deux fois en base donc le hash code et le equals ne tiennent compte que de
     * category
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
