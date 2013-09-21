package org.ourses.server.authentication;

import java.util.Collection;
import java.util.Set;

import org.apache.shiro.authc.Account;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.ourses.server.entities.Profile;

public class BearAccount implements Account {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4826475879469336578L;
	 /**
     * The authentication information (principals and credentials) for this account.
     */
    private SimpleAuthenticationInfo authcInfo;

    /**
     * The authorization information for this account.
     */
    private SimpleAuthorizationInfo authzInfo;
    /**
     * Le profil lié au compte
     */
    private Profile profile;
    
    /**
     * Default no-argument constructor.
     */
    public BearAccount() {
    }
    /**
     * Constructeur d'un compte, le profil est créé en même temps que les infos d'authentication
     * et d'autorisation.
     * @param principal
     * @param credentials
     * @param realmName
     * @param roleNames
     * @param permissions
     */
    public BearAccount(Object principal, Object credentials, String realmName, Set<String> roleNames, Set<Permission> permissions) {
    	this.authcInfo = new SimpleAuthenticationInfo(new SimplePrincipalCollection(principal, realmName), credentials);
        this.authzInfo = new SimpleAuthorizationInfo(roleNames);
        this.authzInfo.setObjectPermissions(permissions);
		this.profile = new Profile();
	}

	/**
     * Renvoie le profil lié au compte
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
     * Returns the principals, aka the identifying attributes (username, user id, first name, last name, etc) of this
     * Account.
     *
     * @return all the principals, aka the identifying attributes, of this Account.
     */
	@Override
	public PrincipalCollection getPrincipals() {
		return authcInfo.getPrincipals();
	}

	/**
     * Sets the principals, aka the identifying attributes (username, user id, first name, last name, etc) of this
     * Account.
     *
     * @param principals all the principals, aka the identifying attributes, of this Account.
     * @see Account#getPrincipals()
     */
    public void setPrincipals(PrincipalCollection principals) {
        this.authcInfo.setPrincipals(principals);
    }
	
	/**
     * Simply returns <code>this.authcInfo.getCredentials</code>.  The <code>authcInfo</code> attribute is constructed
     * via the constructors to wrap the input arguments.
     *
     * @return this Account's credentials.
     */
	@Override
    public Object getCredentials() {
        return authcInfo.getCredentials();
    }

	/**
     * Sets this Account's credentials that verify one or more of the Account's
     * {@link #getPrincipals() principals}, such as a password or private key.
     *
     * @param credentials the credentials associated with this Account that verify one or more of the Account principals.
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
    public Collection<String> getRoles() {
        return authzInfo.getRoles();
    }
    /**
     * Sets the Account's assigned roles.  Simply calls <code>this.authzInfo.setRoles(roles)</code>.
     *
     * @param roles the Account's assigned roles.
     * @see Account#getRoles()
     */
    public void setRoles(Set<String> roles) {
        this.authzInfo.setRoles(roles);
    }
    /**
     * Adds a role to this Account's set of assigned roles.  Simply delegates to
     * <code>this.authzInfo.addRole(role)</code>.
     *
     * @param role a role to assign to this Account.
     */
    public void addRole(String role) {
        this.authzInfo.addRole(role);
    }
	
	/**
     * Returns all String-based permissions assigned to this Account.  Simply delegates to
     * <code>this.authzInfo.getStringPermissions()</code>.
     *
     * @return all String-based permissions assigned to this Account.
     */
    @Override
    public Collection<String> getStringPermissions() {
        return authzInfo.getStringPermissions();
    }

    /**
     * Sets the String-based permissions assigned to this Account.  Simply delegates to
     * <code>this.authzInfo.setStringPermissions(permissions)</code>.
     *
     * @param permissions all String-based permissions assigned to this Account.
     * @see org.apache.shiro.authc.Account#getStringPermissions()
     */
    public void setStringPermissions(Set<String> permissions) {
        this.authzInfo.setStringPermissions(permissions);
    }

    /**
     * Assigns a String-based permission directly to this Account (not to any of its realms).
     *
     * @param permission the String-based permission to assign.
     */
    public void addStringPermission(String permission) {
        this.authzInfo.addStringPermission(permission);
    }

    /**
     * Assigns one or more string-based permissions directly to this Account (not to any of its realms).
     *
     * @param permissions one or more String-based permissions to assign.
     */
    public void addStringPermissions(Collection<String> permissions) {
        this.authzInfo.addStringPermissions(permissions);
    }
	 /**
     * Returns all object-based permissions assigned directly to this Account (not any of its realms).
     *
     * @return all object-based permissions assigned directly to this Account (not any of its realms).
     */
    @Override
    public Collection<Permission> getObjectPermissions() {
        return authzInfo.getObjectPermissions();
    }

    /**
     * Sets all object-based permissions assigned directly to this Account (not any of its realms).
     *
     * @param permissions the object-based permissions to assign directly to this Account.
     */
    public void setObjectPermissions(Set<Permission> permissions) {
        this.authzInfo.setObjectPermissions(permissions);
    }

    /**
     * Assigns an object-based permission directly to this Account (not any of its realms).
     *
     * @param permission the object-based permission to assign directly to this Account (not any of its realms).
     */
    public void addObjectPermission(Permission permission) {
        this.authzInfo.addObjectPermission(permission);
    }

    /**
     * Assigns one or more object-based permissions directly to this Account (not any of its realms).
     *
     * @param permissions one or more object-based permissions to assign directly to this Account (not any of its realms).
     */
    public void addObjectPermissions(Collection<Permission> permissions) {
        this.authzInfo.addObjectPermissions(permissions);
    }
}
