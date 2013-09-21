package org.ourses.server.authentication;

import static org.fest.assertions.Assertions.assertThat;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.junit.Before;
import org.junit.Test;
import org.ourses.server.utility.Safe;

public class RealmTest {
	
	private StaticRealm underTest = new StaticRealm();
	private AuthenticationToken token;
	private PrincipalCollection principals = new SimplePrincipalCollection("Mathieu", "StaticRealm");

	@Before
	public void superSetup(){
		underTest.setAccountDao(new Safe());
		underTest.setCredentialsMatcher(new ReverseCredentialsMatcher());
	}
	
	@Test
	public void shouldGetAuthenticationInfo(){
		token = new UsernamePasswordToken("Mathieu", "Bellange");
		AuthenticationInfo result = underTest.getAuthenticationInfo(token);
		assertThat(result).isNotNull();
		assertThat(result.getPrincipals().getPrimaryPrincipal()).as("le login").isEqualTo("Mathieu");
	}
	
	@Test(expected=AuthenticationException.class)
	public void shouldFailedOnNullLogin(){
		token = new UsernamePasswordToken(null, "Bellange");
		underTest.getAuthenticationInfo(token);
	}
	
	@Test
	public void shouldGetAuthorizationInfo(){
		AuthorizationInfo authorization = underTest.doGetAuthorizationInfo(principals);
		assertThat(authorization.getRoles()).as("Contient les rôles de l'utilisateur").contains("Admin");
		assertThat(authorization.getStringPermissions()).as("Contient les permissions de l'utilisateur").contains("safe:*");
	}
	
	@Test(expected=AuthenticationException.class)
	public void shouldFailedOnNullPrincipals(){
		underTest.doGetAuthorizationInfo(null);
	}
}
