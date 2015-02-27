package org.ourses.server.administration.domain.entities;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

@Entity
public class RenewPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "renew_password_seq_gen")
    @SequenceGenerator(name = "renew_password_seq_gen", sequenceName = "renew_password_seq")
    private Long id;
    private String url;
    private Date expiredDate;
    private BearAccount account;

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public Date getExpiredDate() {
        return expiredDate;
    }

    public BearAccount getAccount() {
        return account;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public void setUrl(final String url) {
        this.url = url;
    }

    public void setExpiredDate(final Date expiredDate) {
        this.expiredDate = expiredDate;
    }

    public void setAccount(final BearAccount account) {
        this.account = account;
    }

}
