package org.ourses.server.security.helpers;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.security.util.SecurityUtility;
import org.ourses.server.authentication.helpers.BearAccountHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.annotations.VisibleForTesting;

@Component
public class SecurityHelperImpl implements SecurityHelper {
	
	@Autowired
	private BearAccountHelper accountDao;

	@Override
	public void doCredentialsMatch(String login, String password) throws AuthenticationException {
		 // vérification de l'user name
        checkNotNull(login, "Null usernames are not allowed by this realm.");

        // vérification du password
        checkNotNull(password, "No account found for user [" + login + "]");
            
        String username_password = accountDao.getPassword(login);
        if(!username_password.equals(SecurityUtility.encryptedPassword(password))){
        	throw new AuthenticationException();
        }
	}
	
	private void checkNotNull(Object reference, String message) {
        if (reference == null) {
            throw new AuthenticationException(message);
        }
    }
	
	@VisibleForTesting
    protected void setAccountDao(BearAccountHelper accountDao){
    	this.accountDao = accountDao;
    }

}
