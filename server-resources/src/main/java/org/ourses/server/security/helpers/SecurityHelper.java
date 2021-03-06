package org.ourses.server.security.helpers;

import java.util.Set;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.server.security.domain.entities.OurseSecurityToken;

public interface SecurityHelper {

    OurseSecurityToken findByToken(String token);

    void doCredentialsMatch(String login, String password) throws AuthenticationException;

    boolean hasRoles(OurseSecurityToken token, Set<String> rolesArray);

    String encryptedPassword(String newPassword);

    void checkAuthenticatedUser(String login, String token) throws AuthenticationException;

}
