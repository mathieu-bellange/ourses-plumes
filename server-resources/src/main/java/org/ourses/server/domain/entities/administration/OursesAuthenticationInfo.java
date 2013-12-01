package org.ourses.server.domain.entities.administration;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OursesAuthenticationInfo implements AuthenticationInfo {

    /**
     * 
     */
    private static final long serialVersionUID = 4106888835233609090L;

    public OursesAuthenticationInfo() {

    }

    public OursesAuthenticationInfo(Object principal, Object credentials) {
        this.mail = (String) principal;
        this.principals = new SimplePrincipalCollection(principal, BearAccount.REALM_NAME);
        this.credentials = (String) credentials;
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

    private String mail;

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
        this.principals = new SimplePrincipalCollection(mail, BearAccount.REALM_NAME);
    }

    @Transient
    private PrincipalCollection principals;

    @Override
    public PrincipalCollection getPrincipals() {
        return principals;
    }

    public void setPrincipals(PrincipalCollection principals) {
        this.principals = principals;
    }

    private String credentials;

    @Override
    public String getCredentials() {
        return credentials;
    }

    public void setCredentials(String credentials) {
        this.credentials = credentials;

    }
}
