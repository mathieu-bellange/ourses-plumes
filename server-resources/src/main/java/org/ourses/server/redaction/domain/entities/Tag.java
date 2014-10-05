package org.ourses.server.redaction.domain.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

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

    public Tag(Long id) {
		this.id = id;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "tag_seq_gen")
    @SequenceGenerator(name = "tag_seq_gen", sequenceName = "tag_seq")
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

    public static Set<Tag> findAllTag(String criteria) {
        return Ebean.find(Tag.class).where().like("tag", criteria + "%").findSet();
    }

    public static Tag find(String tag) {
        return Ebean.find(Tag.class).where().eq("tag", tag).findUnique();
    }

    public static Tag find(Long id) {
        return Ebean.find(Tag.class, id);
    }

    public void save() {
        Ebean.save(this);

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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((tag == null) ? 0 : tag.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Tag other = (Tag) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (tag == null) {
			if (other.tag != null)
				return false;
		} else if (!tag.equals(other.tag))
			return false;
		return true;
	}
    
    

}
