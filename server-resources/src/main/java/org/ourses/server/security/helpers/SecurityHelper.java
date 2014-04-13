package org.ourses.server.security.helpers;

import org.apache.shiro.authc.AuthenticationException;


public interface SecurityHelper {
	
	void doCredentialsMatch(String login, String password) throws AuthenticationException;

}
