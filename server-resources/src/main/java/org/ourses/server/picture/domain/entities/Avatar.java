package org.ourses.server.picture.domain.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.ourses.server.picture.domain.dto.AvatarDTO;
import org.springframework.beans.BeanUtils;

import com.avaje.ebean.Ebean;
import com.google.common.collect.Sets;

@Entity
public class Avatar {

    @Id
    @GeneratedValue
    private Long id;
    private byte[] image;
    private String path;

    public Avatar() {
    }

    public Avatar(long id, String path, byte[] image) {
        this.id = id;
        this.image = image;
        this.path = path;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public static Avatar findAvatar(Long id) {
        return Ebean.find(Avatar.class, id);
    }

    public static Avatar findDefaultAvatar() {
        return Ebean.find(Avatar.class, 0l);
    }

    public void save() {
        Ebean.save(this);
    }

    public void update(String... ppts) {
        Ebean.update(this, Sets.newHashSet(ppts));
    }

    public AvatarDTO toAvatarDTO() {
        AvatarDTO dto = new AvatarDTO();
        BeanUtils.copyProperties(this, dto, new String[] { "image" });
        return dto;
    }

}
