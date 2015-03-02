package org.ourses.server.security.domain.entities;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

import org.ourses.security.authentication.AuthcToken;

import com.avaje.ebean.Ebean;

@Entity
public class OurseSecurityToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "ourse_security_token_seq_gen")
    @SequenceGenerator(name = "ourse_security_token_seq_gen", sequenceName = "ourse_security_token_seq")
    private Long id;
    private String token;
    private Date expirationDate;
    private String login;

    public OurseSecurityToken() {

    }

    public OurseSecurityToken(final String login, final AuthcToken authcToken) {
        this.login = login;
        this.token = authcToken.getToken();
        this.expirationDate = authcToken.getExpirationDate();
    }

    public OurseSecurityToken(final String login, final String token, final Date expirationDate) {
        this.login = login;
        this.token = token;
        this.expirationDate = expirationDate;
    }

    public String getToken() {
        return token;
    }

    public void setToken(final String token) {
        this.token = token;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(final Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(final String login) {
        this.login = login;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void save() {
        Ebean.save(this);
    }

    public static OurseSecurityToken findByToken(final String token) {
        return Ebean.find(OurseSecurityToken.class).where().eq("token", token).findUnique();
    }

    public static OurseSecurityToken findByLogin(final String login) {
        return Ebean.find(OurseSecurityToken.class).where().eq("login", login).findUnique();
    }

    public void deleteMe() {
        Ebean.delete(this);
    }

    public static OurseSecurityToken findByTokenId(final Long tokenId) {
        return Ebean.find(OurseSecurityToken.class, tokenId);
    }
}
