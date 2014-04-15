package org.ourses.server.domain.entities.security;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.ourses.security.authentication.AuthcToken;

import com.avaje.ebean.Ebean;

@Entity
public class OurseAuthcToken {

    private String token;
    private Date expirationDate;
    @Id
    private String login;

    public OurseAuthcToken() {

    }

    public OurseAuthcToken(String login, AuthcToken authcToken) {
        this.login = login;
        this.token = authcToken.getToken();
        this.expirationDate = authcToken.getExpirationDate();
    }

    public OurseAuthcToken(String login, String token, Date expirationDate) {
        this.login = login;
        this.token = token;
        this.expirationDate = expirationDate;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void save() {
        Ebean.save(this);
    }

    public static OurseAuthcToken findByToken(String token) {
        return Ebean.find(OurseAuthcToken.class).where().eq("token", token).findUnique();
    }

    public static OurseAuthcToken findByLogin(String login) {
        return Ebean.find(OurseAuthcToken.class).where().eq("login", login).findUnique();
    }
}
