package org.ourses.server.security.domain.entities;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.ourses.security.authentication.AuthcToken;

import com.avaje.ebean.Ebean;

@Entity
public class OurseSecurityToken {

	@Id
    private String token;
    private Date expirationDate;
    private String login;

    public OurseSecurityToken() {

    }

    public OurseSecurityToken(String login, AuthcToken authcToken) {
        this.login = login;
        this.token = authcToken.getToken();
        this.expirationDate = authcToken.getExpirationDate();
    }

    public OurseSecurityToken(String login, String token, Date expirationDate) {
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

    public static OurseSecurityToken findByToken(String token) {
        return Ebean.find(OurseSecurityToken.class).where().eq("token", token).findUnique();
    }

    public static OurseSecurityToken findByLogin(String login) {
        return Ebean.find(OurseSecurityToken.class).where().eq("login", login).findUnique();
    }
    
    public void deleteMe(){
    	Ebean.delete(this);
    }
}
