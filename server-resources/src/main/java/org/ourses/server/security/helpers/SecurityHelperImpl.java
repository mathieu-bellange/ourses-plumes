package org.ourses.server.security.helpers;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.security.util.SecurityUtility;
import org.ourses.server.administration.helpers.BearAccountHelper;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Strings;

@Component
public class SecurityHelperImpl implements SecurityHelper {

    Logger logger = LoggerFactory.getLogger(SecurityHelperImpl.class);
    @Autowired
    private BearAccountHelper accountDao;

    @Override
    public void doCredentialsMatch(String login, String password) throws AuthenticationException {
        // vérification de l'user name
        checkNotNull(login, "Null usernames are not allowed by this realm.");

        // vérification du password
        checkNotNull(password, "No account found for user [" + login + "]");

        String username_password = accountDao.getPassword(login);
        if (username_password == null || !username_password.equals(SecurityUtility.encryptedPassword(password))) {
            throw new AuthenticationException();
        }
    }

    private void checkNotNull(String reference, String message) {
        if (Strings.isNullOrEmpty(reference)) {
            throw new AuthenticationException(message);
        }
    }

    @Override
    public OurseSecurityToken findByToken(String token) {
        return OurseSecurityToken.findByToken(token);
    }

    @VisibleForTesting
    protected void setAccountDao(BearAccountHelper accountDao) {
        this.accountDao = accountDao;
    }

}
