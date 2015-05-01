package org.ourses.server.administration.domain.entities;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Transient;
import javax.persistence.Version;

import org.apache.shiro.authc.Account;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.subject.PrincipalCollection;
import org.joda.time.DateTime;
import org.ourses.server.administration.domain.dto.BearAccountDTO;
import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.administration.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.administration.domain.exception.AccountProfileNullException;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.util.RolesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import com.google.common.collect.Sets;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class BearAccount implements Account {

    /**
	 * 
	 */
    private static final long serialVersionUID = -4826475879469336578L;
    static Logger logger = LoggerFactory.getLogger(BearAccount.class);

    protected static final String REALM_NAME = "staticRealm";
    
    public static Long NO_ROLE_ID = -1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "bear_account_seq_gen")
    @SequenceGenerator(name = "bear_account_seq_gen", sequenceName = "bear_account_seq")
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    private String renewPasswordDate;

    public String getRenewPasswordDate() {
        return renewPasswordDate;
    }

    public void setRenewPasswordDate(final String renewPasswordDate) {
        this.renewPasswordDate = renewPasswordDate;
    }

    @Version
    private Integer version;

    public Integer getVersion() {
        return version;
    }

    public void setVersion(final Integer version) {
        this.version = version;
    }

    /**
     * The authentication information (principals and credentials) for this account.
     */
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, optional = false)
    private OursesAuthenticationInfo authcInfo;

    public OursesAuthenticationInfo getAuthcInfo() {
        return authcInfo;
    }

    public void setAuthcInfo(final OursesAuthenticationInfo authcInfo) {
        this.authcInfo = authcInfo;
    }

    /**
     * The authorization information for this account.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.REFRESH)
    private OursesAuthorizationInfo authzInfo;

    public OursesAuthorizationInfo getAuthzInfo() {
        return authzInfo;
    }

    public void setAuthzInfo(final OursesAuthorizationInfo authzInfo) {
        this.authzInfo = authzInfo;
    }

    /**
     * Le profil lié au compte
     */
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    private Profile profile;

    /**
     * Default no-argument constructor.
     */
    public BearAccount() {
    }

    public BearAccount(final Long id, final Object principal, final Object credentials, final Profile profile,
            final Integer version) {
        this.id = id;
        if (principal != null) {
            this.authcInfo = new OursesAuthenticationInfo(principal, credentials);
        }
        this.profile = profile;
        this.version = version;
    }

    /**
     * Renvoie le profil lié au compte
     * 
     * @return Profile profile
     */
    public Profile getProfile() {
        return profile;
    }

    /**
     * Set le profil lié au compte
     */
    public void setProfile(final Profile profile) {
        this.profile = profile;
    }

    /**
     * Returns the principals, aka the identifying attributes (username, user id, first name, last name, etc) of this
     * Account.
     * 
     * @return all the principals, aka the identifying attributes, of this Account.
     */
    @Override
    @Transient
    public PrincipalCollection getPrincipals() {
        return authcInfo.getPrincipals();
    }

    /**
     * Sets the principals, aka the identifying attributes (username, user id, first name, last name, etc) of this
     * Account.
     * 
     * @param principals
     *            all the principals, aka the identifying attributes, of this Account.
     * @see Account#getPrincipals()
     */
    public void setPrincipals(final PrincipalCollection principals) {
        this.authcInfo.setPrincipals(principals);
    }

    /**
     * Simply returns <code>this.authcInfo.getCredentials</code>. The <code>authcInfo</code> attribute is constructed
     * via the constructors to wrap the input arguments.
     * 
     * @return this Account's credentials.
     */
    @Override
    @Transient
    public Object getCredentials() {
        return authcInfo.getCredentials();
    }

    /**
     * Sets this Account's credentials that verify one or more of the Account's {@link #getPrincipals() principals},
     * such as a password or private key.
     * 
     * @param credentials
     *            the credentials associated with this Account that verify one or more of the Account principals.
     * @see org.apache.shiro.authc.Account#getCredentials()
     */
    public void setCredentials(final Object credentials) {
        this.authcInfo.setCredentials((String) credentials);
    }

    /**
     * Returns <code>this.authzInfo.getRoles();</code>
     * 
     * @return the Account's assigned roles.
     */
    @Override
    @Transient
    public Collection<String> getRoles() {
        return authzInfo.getRoles();
    }

    /**
     * Sets the Account's assigned roles. Simply calls <code>this.authzInfo.setRoles(roles)</code>.
     * 
     * @param roles
     *            the Account's assigned roles.
     * @see Account#getRoles()
     */
    public void setRoles(final Set<String> roles) {
        this.authzInfo.setRoles(roles);
    }

    /**
     * Adds a role to this Account's set of assigned roles. Simply delegates to
     * <code>this.authzInfo.addRole(role)</code>.
     * 
     * @param role
     *            a role to assign to this Account.
     */
    public void addRole(final String role) {
        this.authzInfo.addRole(role);
    }

    @Override
    @Transient
    public Collection<String> getStringPermissions() {
        return Sets.newHashSet();
    }

    @Override
    @Transient
    public Collection<Permission> getObjectPermissions() {
        return Sets.newHashSet();
    }

    public void save() throws AccountProfileNullException, AccountAuthcInfoNullException, AccountAuthzInfoNullException {
        if (profile == null || profile.getPseudo() == null) {
            throw new AccountProfileNullException();
        }
        // le principal ne peut pas être null, shiro explose avant la création du bean
        if (authcInfo == null || authcInfo.getCredentials() == null) {
            throw new AccountAuthcInfoNullException();
        }
        if (authzInfo == null) {
            throw new AccountAuthzInfoNullException();
        }
        authcInfo = new OursesAuthenticationInfo(authcInfo.getMail(), authcInfo.getCredentials());
        Ebean.save(this);
    }

    public void update(final String... updateProps) {
        Ebean.update(this, Sets.newHashSet(updateProps));
    }

    public void delete() {
        Ebean.delete(BearAccount.class, id);
    }

    public static BearAccount find(final Long id) {
        return Ebean.find(BearAccount.class).fetch("authcInfo").fetch("authzInfo").fetch("profile", "pseudo").where()
                .eq("id", id).findUnique();
    }

    /**
     * Récupère que les infos administrative du compte
     * 
     * @param id
     * @return
     */
    public static BearAccount findAdminAccount(final Long id) {
        return Ebean.find(BearAccount.class).fetch("authcInfo").setId(id).findUnique();
    }

    /**
     * Récupère que les infos administrative du compte par le profil
     * 
     * @param id
     * @return
     */
    public static BearAccount findAdminAccountByProfileId(final Long profileId) {
        return Ebean.find(BearAccount.class).fetch("authcInfo").fetch("authzInfo").where().eq("profile.id", profileId)
                .findUnique();
    }

    /**
     * Récupère la liste des comptes avec leurs informations administratives
     * 
     * @return
     */
    public static List<BearAccount> findAllAdministrationBearAccounts() {
        return Ebean.find(BearAccount.class).fetch("authcInfo").fetch("authzInfo").fetch("profile").where(Expr.not(Expr.eq("id", NO_ROLE_ID))).findList();
    }

    public static Set<BearAccount> findAdminAccounts() {
        return Ebean.find(BearAccount.class).fetch("authcInfo").fetch("authzInfo").where()
                .and(Expr.eq("authzInfo.mainRole", RolesUtil.ADMINISTRATRICE), Expr.not(Expr.eq("id", NO_ROLE_ID))).findSet();
    }

    /**
     * Récupère la mdp encrypté
     * 
     * @param mail
     * @return
     */
    public static String getBearAccountCredentials(final String mail) {
        String password = null;
        BearAccount account = Ebean.find(BearAccount.class).fetch("authcInfo").where().eq("authcInfo.mail", mail)
                .findUnique();
        if (account != null) {
            password = account.getAuthcInfo().getCredentials();
        }
        return password;
    }

    /**
     * Récupère la liste des roles
     * 
     * @param mail
     * @return
     */
    public static Set<String> getBearAccountRoles(final String mail) {
        BearAccount account = Ebean.find(BearAccount.class).fetch("authzInfo").where().eq("authcInfo.mail", mail)
                .findUnique();
        Set<String> roles = Sets.newHashSet();
        if (account != null) {
            roles.addAll(account.getAuthzInfo().getRoles());
        }
        return roles;
    }

    /**
     * Récupère un compte par son login
     * 
     * @param mail
     * @return
     */
    public static BearAccount findAuthcUserProperties(final String mail) {
        return Ebean.find(BearAccount.class).fetch("authcInfo").fetch("authzInfo", "mainRole").fetch("profile")
                .fetch("profile.avatar", "path").where().and(Expr.not(Expr.eq("id", NO_ROLE_ID)), Expr.eq("authcInfo.mail", mail)).findUnique();
    }

    public static BearAccount findAccountByPseudo(final String pseudoBeautify) {
        return Ebean.find(BearAccount.class).fetch("authcInfo").where().eq("profile.pseudoBeautify", pseudoBeautify)
                .findUnique();
    }

    public static void deleteOldToken(final String mail) {
        Set<OurseSecurityToken> tokensToDelete = Ebean.find(OurseSecurityToken.class).where().eq("login", mail)
                .le("expirationDate", DateTime.now().minusDays(1)).findSet();
        logger.debug("token to delete : {}", tokensToDelete);
        Ebean.delete(tokensToDelete);
    }

    /**
     * Transforme un bear account en bear account DTO. Attention ebean ne récupère pas l'ensemble des données du bean,
     * il ne le fait que sur demande. On ne doit pas copier le mdp dans le dto, il reste côté serveur
     * 
     * @return
     */
    public BearAccountDTO toBearAccountDTO() {
        String mail = null;
        OursesAuthzInfoDTO role = null;
        ProfileDTO profileDTO = null;
        if (authcInfo != null) {
            mail = (String) authcInfo.getPrincipals().getPrimaryPrincipal();
        }
        if (authzInfo != null) {
            role = authzInfo.toOursesAuthzInfoDTO();
        }
        if (profile != null) {
            profileDTO = profile.toProfileDTO();
        }
        BearAccountDTO bearAccountDTO = new BearAccountDTO(this.id, mail, null, profileDTO, role, version);
        return bearAccountDTO;
    }

    public void updateCredentials() {
        this.authcInfo.update(Sets.newHashSet("credentials"));
    }
}
