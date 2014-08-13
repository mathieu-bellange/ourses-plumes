package org.ourses.server.administration.domain.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.avaje.ebean.Ebean;

@Entity
@Table(name = "profile_img")
public class Avatar {

    @Id
    @GeneratedValue
    private Long id;
    private byte[] image;

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

    public static Avatar findAvatar(Long id) {
        return Ebean.find(Avatar.class, id);
    }
}
