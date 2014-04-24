package org.ourses.server.security.helpers;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.server.security.domain.entities.OurseSecurityToken;

public interface SecurityHelper {

    OurseSecurityToken findByToken(String token);

    void doCredentialsMatch(String login, String password) throws AuthenticationException;

}
