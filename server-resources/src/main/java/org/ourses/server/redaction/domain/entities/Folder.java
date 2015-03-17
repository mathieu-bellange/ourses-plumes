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
import org.ourses.server.redaction.domain.dto.FolderDTO;
import org.springframework.beans.BeanUtils;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.ExpressionList;

@Entity
public class Folder implements Serializable {

    /**
     * 
     */
    private static final long serialVersionUID = -2048748498727928292L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "folder_seq_gen")
    @SequenceGenerator(name = "folder_seq_gen", sequenceName = "folder_seq")
    private Long id;
    private String name;
    private String desc;
    private String hash;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public String getHash() {
        return hash;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public void setDesc(final String desc) {
        this.desc = desc;
    }

    public void setHash(final String hash) {
        this.hash = hash;
    }

    public static Set<Folder> findAllFolder() {
        return Ebean.find(Folder.class).findSet();
    }

    public static int folderWithSameHash(final String hash, final Long id) {
        ExpressionList<Folder> query = Ebean.find(Folder.class).where().eq("hash", hash);
        if (id != null) {
            query.ne("id", id);
        }
        return query.findRowCount();
    }

    public void save() {
        Ebean.save(this);
    }

    public FolderDTO toFolderDTO() {
        FolderDTO folderDTO = new FolderDTO();
        BeanUtils.copyProperties(this, folderDTO);
        return folderDTO;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
