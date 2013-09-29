package org.ourses.server.domain.entities.administration;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Transient;

import org.apache.shiro.authc.Account;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;
import com.google.common.collect.Sets;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class BearAccount implements Account {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4826475879469336578L;

	private static final String REALM_NAME = "staticRealm";	
	
	@Id
	@GeneratedValue
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	/**
	 * The authentication information (principals and credentials) for this
	 * account.
	 */
	@Transient
	private SimpleAuthenticationInfo authcInfo;

	/**
	 * The authorization information for this account.
	 */
	@OneToOne(cascade=CascadeType.ALL,fetch=FetchType.LAZY,optional=false)
	private OursesAuthorizationInfo authzInfo;
	
	public OursesAuthorizationInfo getAuthzInfo() {
		return authzInfo;
	}

	public void setAuthzInfo(OursesAuthorizationInfo authzInfo) {
		this.authzInfo = authzInfo;
	}

	/**
	 * Le profil lié au compte
	 */
	@OneToOne(cascade=CascadeType.ALL,fetch=FetchType.LAZY,optional=false)
	private Profile profile;

	/**
	 * Default no-argument constructor.
	 */
	public BearAccount() {
	}

	/**
	 * Constructeur d'un compte, le profil est créé en même temps que les infos
	 * d'authentication et d'autorisation.
	 * 
	 * @param principal
	 * @param credentials
	 * @param realmName
	 * @param roleNames
	 * @param permissions
	 */
	public BearAccount(Object principal, Object credentials,
			Set<String> roleNames, Profile profile) {
		this.authcInfo = new SimpleAuthenticationInfo(
				new SimplePrincipalCollection(principal, REALM_NAME),
				credentials);
		this.authzInfo = new OursesAuthorizationInfo(roleNames);
		this.profile = profile;
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
	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	/**
	 * Returns the principals, aka the identifying attributes (username, user
	 * id, first name, last name, etc) of this Account.
	 * 
	 * @return all the principals, aka the identifying attributes, of this
	 *         Account.
	 */
	@Override
	@Transient
	public PrincipalCollection getPrincipals() {
		return authcInfo.getPrincipals();
	}

	/**
	 * Sets the principals, aka the identifying attributes (username, user id,
	 * first name, last name, etc) of this Account.
	 * 
	 * @param principals
	 *            all the principals, aka the identifying attributes, of this
	 *            Account.
	 * @see Account#getPrincipals()
	 */
	public void setPrincipals(PrincipalCollection principals) {
		this.authcInfo.setPrincipals(principals);
	}

	/**
	 * Simply returns <code>this.authcInfo.getCredentials</code>. The
	 * <code>authcInfo</code> attribute is constructed via the constructors to
	 * wrap the input arguments.
	 * 
	 * @return this Account's credentials.
	 */
	@Override
	@Transient
	public Object getCredentials() {
		return authcInfo.getCredentials();
	}

	/**
	 * Sets this Account's credentials that verify one or more of the Account's
	 * {@link #getPrincipals() principals}, such as a password or private key.
	 * 
	 * @param credentials
	 *            the credentials associated with this Account that verify one
	 *            or more of the Account principals.
	 * @see org.apache.shiro.authc.Account#getCredentials()
	 */
	public void setCredentials(Object credentials) {
		this.authcInfo.setCredentials(credentials);
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
	 * Sets the Account's assigned roles. Simply calls
	 * <code>this.authzInfo.setRoles(roles)</code>.
	 * 
	 * @param roles
	 *            the Account's assigned roles.
	 * @see Account#getRoles()
	 */
	public void setRoles(Set<String> roles) {
		this.authzInfo.setRoles(roles);
	}

	/**
	 * Adds a role to this Account's set of assigned roles. Simply delegates to
	 * <code>this.authzInfo.addRole(role)</code>.
	 * 
	 * @param role
	 *            a role to assign to this Account.
	 */
	public void addRole(String role) {
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
	
	public void save() {
		//TODO gérer l'optimistic lock
		Ebean.save(this);
	}

	public void delete() {
		Ebean.delete(BearAccount.class, id);
	}
	
	public static List<BearAccount> findAllBearAccounts(){
		return Ebean.find(BearAccount.class).findList();
	}
	
	public BearAccountDTO toBearAccountDTO(){
		return new BearAccountDTO( (String)authcInfo.getPrincipals().getPrimaryPrincipal(), (String)authcInfo.getCredentials(), 
				Sets.newHashSet(authzInfo.getRoles()), profile.toProfileDTO());
	}
	
	public static BearAccount getBearAccountByMail(String mail){
		return Ebean.find(BearAccount.class).where().eq("mail", mail).findUnique();
	}

}
