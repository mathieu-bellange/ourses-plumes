package org.ourses.server.redaction.domain.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Tag implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = -9104090602361704641L;

    public Tag(Long id, String tag) {
        this.id = id;
        this.tag = tag;
    }

    public Tag() {

    }

    @Id
    @GeneratedValue
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private String tag;

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public static Set<Tag> findAllTag() {
        return Ebean.find(Tag.class).findSet();
    }

    public static Tag find(Long id) {
        return Ebean.find(Tag.class, id);
    }

    public TagDTO toTagDTO() {
        TagDTO tag = new TagDTO();
        BeanUtils.copyProperties(this, tag);
        return tag;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
