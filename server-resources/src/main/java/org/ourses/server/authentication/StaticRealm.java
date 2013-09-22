package org.ourses.server.authentication;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.ourses.server.authentication.repository.AccountDao;

import com.google.common.annotations.VisibleForTesting;

/**
 * Realm qui contient toute la logique d'authentification et de permissions. récupère le login mdp en base grâce au
 * login saisi, vérification de test basique.
 * 
 * @author mbellang
 * 
 */
public class StaticRealm extends AuthorizingRealm {
	
	private AccountDao accountDao;

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;

        // vérification de l'user name
        String username = upToken.getUsername();
        checkNotNull(username, "Null usernames are not allowed by this realm.");

        // vérification du password
        String password = accountDao.getPassword(username);
        checkNotNull(password, "No account found for user [" + username + "]");

        return new SimpleAuthenticationInfo(username, password.toCharArray(), getName());
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        checkNotNull(principals, "PrincipalCollection method argument cannot be null.");
        String username = (String) principals.getPrimaryPrincipal();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo(accountDao.getRoles(username));
        info.setStringPermissions(accountDao.getPermissions(username));
        return info;
    }

    private void checkNotNull(Object reference, String message) {
        if (reference == null) {
            throw new AuthenticationException(message);
        }
    }
    
    @VisibleForTesting
    protected void setAccountDao(AccountDao accountDao){
    	this.accountDao = accountDao;
    }
}
