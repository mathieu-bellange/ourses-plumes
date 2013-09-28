package org.ourses.server.domain.entities.administration;

import java.util.Collection;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.Permission;
import org.ourses.server.authentication.util.ConstantsUtil;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.google.common.collect.Sets;

@Entity
@Component
@Scope(value=ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OursesAuthorizationInfo implements AuthorizationInfo {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4775014513590290508L;
	
	@Id
	@GeneratedValue
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	private String rolesForDb;

	 public String getRolesForDb() {
		return rolesForDb;
	}

	public void setRolesForDb(String rolesForDb) {
		this.rolesForDb = rolesForDb;
		this.roles = ConstantsUtil.rolesForShiro(rolesForDb);
	}

	/**
     * The internal roles collection.
     */
	@Transient
    protected Set<String> roles;

    /**
     * Default no-argument constructor.
     */
    public OursesAuthorizationInfo() {
    }

    /**
     * Creates a new instance with the specified roles and no permissions.
     * @param roles the roles assigned to the realm account.
     */
    public OursesAuthorizationInfo(Set<String> roles) {
        this.roles = roles;
    }

    /**
     * Sets the roles assigned to the account.
     * @param roles the roles assigned to the account.
     */
    public void setRoles(Set<String> roles) {
        this.roles = roles;
        this.rolesForDb = ConstantsUtil.rolesForDb(roles);
    }

    /**
     * Adds (assigns) a role to those associated with the account.  If the account doesn't yet have any roles, a
     * new roles collection (a Set) will be created automatically.
     * @param role the role to add to those associated with the account.
     */
    public void addRole(String role) {
        if (this.roles == null) {
            this.roles = Sets.newHashSet();
        }
        this.roles.add(role);
    }

    /**
     * Adds (assigns) multiple roles to those associated with the account.  If the account doesn't yet have any roles, a
     * new roles collection (a Set) will be created automatically.
     * @param roles the roles to add to those associated with the account.
     */
    public void addRoles(Collection<String> roles) {
        if (this.roles == null) {
            this.roles = Sets.newHashSet();
        }
        this.roles.addAll(roles);
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

	@Override
	@Transient
	public Collection<String> getRoles() {
		return roles;
	}
}
