package org.ourses.server.authentication;

import static org.fest.assertions.Assertions.assertThat;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAccount;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.junit.Test;

public class MatcherTest {
	
	private CredentialsMatcher undertest = new ReverseCredentialsMatcher();
	private AuthenticationToken token = new UsernamePasswordToken("Mathieu", "Bellange");
	private AuthenticationInfo account;
		
	@Test
	public void shouldCredentialMatch(){
		account = new SimpleAccount("Mathieu", "894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170".toCharArray(),"StaticRealm");
		assertThat(undertest.doCredentialsMatch(token, account)).isTrue();
	}
	
	@Test
	public void shouldCredentialNotMatch(){
		account = new SimpleAccount("Mathieu", "WrongPassword".toCharArray(),"StaticRealm");
		assertThat(undertest.doCredentialsMatch(token, account)).isFalse();
	}
}
