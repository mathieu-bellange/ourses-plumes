package org.ourses.server.security.helpers;

import javax.servlet.ServletResponse;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.shiro.authc.AuthenticationException;

public interface SecurityHelper {

    void doCredentialsMatch(String login, String password) throws AuthenticationException;

    void sendChallenge(ServletResponse response);

    ResponseBuilder sendChallenge();

}
