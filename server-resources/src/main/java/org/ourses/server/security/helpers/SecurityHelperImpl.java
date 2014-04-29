package org.ourses.server.security.helpers;

import java.util.Set;

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
    private BearAccountHelper bearAccountHelper;

    @Override
    public void doCredentialsMatch(String login, String password) throws AuthenticationException {
        // vérification de l'user name
        checkNotNull(login, "Null usernames are not allowed by this realm.");

        // vérification du password
        checkNotNull(password, "No account found for user [" + login + "]");

        String username_password = bearAccountHelper.getPassword(login);
        if (username_password == null || !username_password.equals(SecurityUtility.encryptedPassword(password))) {
            throw new AuthenticationException();
        }
    }

    @Override
    public boolean hasRoles(OurseSecurityToken securityToken, Set<String> rolesArray) {
        boolean isAuthorized = false;
        if (securityToken != null) {
            // recherche du rôle de l'utilisateur
            Set<String> roles = bearAccountHelper.getRoles(securityToken.getLogin());
            for (String role : roles) {
                logger.info(role);
            }
            isAuthorized = roles.containsAll(rolesArray);
        }
        return isAuthorized;
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
        this.bearAccountHelper = accountDao;
    }

    @Override
    public String encryptedPassword(String newPassword) {
        return SecurityUtility.encryptedPassword(newPassword);
    }

    @Override
    public void checkAuthenticatedUser(String login, String token) throws AuthenticationException {
        OurseSecurityToken ourseToken = findByToken(token);
        if (!ourseToken.getLogin().equals(login)) {
            throw new AuthenticationException();
        }
    }

}
