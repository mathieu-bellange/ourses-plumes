package org.ourses.server.security.helpers;

import java.util.Date;
import java.util.Set;

import org.apache.shiro.authc.AuthenticationException;
import org.fest.assertions.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.ourses.security.util.SecurityUtility;
import org.ourses.server.administration.helpers.BearAccountHelper;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.util.RolesUtil;

import com.google.common.collect.Sets;

public class SecurityHelperTest {

    private final SecurityHelperImpl undertest = new SecurityHelperImpl();
    @Mock
    private BearAccountHelper mockHelper;

    public SecurityHelperTest() {
        MockitoAnnotations.initMocks(this);
    }

    @Before
    public void setUp() {
        undertest.setAccountDao(mockHelper);
    }

    @Test
    public void shouldCredentialMatch() {
        // prepare
        String passwordExpected = SecurityUtility.encryptedPassword("Bellange");
        Mockito.when(mockHelper.getPassword(Mockito.anyString())).thenReturn(passwordExpected);
        // verify
        undertest.doCredentialsMatch("mathieu", "Bellange");
    }

    @Test(expected = AuthenticationException.class)
    public void shouldCredentialNotMatch() {
        // prepare
        String passwordExpected = SecurityUtility.encryptedPassword("Bellang");
        Mockito.when(mockHelper.getPassword(Mockito.anyString())).thenReturn(passwordExpected);
        // verify
        undertest.doCredentialsMatch("mathieu", "Bellange");
    }

    @Test(expected = AuthenticationException.class)
    public void shouldCredentialNotMatchWithNullLogin() {
        // prepare
        String passwordExpected = SecurityUtility.encryptedPassword("Bellange");
        Mockito.when(mockHelper.getPassword(Mockito.anyString())).thenReturn(passwordExpected);
        // verify
        undertest.doCredentialsMatch(null, "Bellange");
    }

    @Test(expected = AuthenticationException.class)
    public void shouldCredentialNotMatchWithNullPassword() {
        // prepare
        String passwordExpected = SecurityUtility.encryptedPassword("Bellange");
        Mockito.when(mockHelper.getPassword(Mockito.anyString())).thenReturn(passwordExpected);
        // verify
        undertest.doCredentialsMatch("mathieu", null);
    }

    @Test(expected = AuthenticationException.class)
    public void shouldCredentialNotMatchWithNullPasswordInBDD() {
        // prepare
        Mockito.when(mockHelper.getPassword(Mockito.anyString())).thenReturn(null);
        // verify
        undertest.doCredentialsMatch("mathieu", "Bellange");
    }
    
    @Test
    public void shouldHaveAllRoles() {
        // prepare - la date n'est pas testée
    	OurseSecurityToken token = new OurseSecurityToken("login","fglhsfgoihzejkfbndsjbfhkjs", new Date());
    	//roles exigés
    	Set<String> roles = Sets.newHashSet(RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE);
    	Set<String> accountRoles = Sets.newHashSet(RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE, RolesUtil.LECTEUR_LECTRICE);
        Mockito.when(mockHelper.getRoles("login")).thenReturn(accountRoles);
        // verify
        Assertions.assertThat(undertest.hasRoles(token, roles)).isTrue();
    }
    
    @Test
    public void shouldNotHaveAllRoles() {
    	// prepare - la date n'est pas testée
    	OurseSecurityToken token = new OurseSecurityToken("login","fglhsfgoihzejkfbndsjbfhkjs", new Date());
    	//roles exigés
    	Set<String> roles = Sets.newHashSet(RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE);
    	Set<String> accountRoles = Sets.newHashSet( RolesUtil.REDACTRICE, RolesUtil.LECTEUR_LECTRICE);
    	Mockito.when(mockHelper.getRoles("login")).thenReturn(accountRoles);
    	// verify
    	Assertions.assertThat(undertest.hasRoles(token, roles)).isFalse();
    }
    
    @Test
    public void shouldNotHaveRolesWithNullToken() {
    	// prepare - la date n'est pas testée
    	OurseSecurityToken token = null;
    	//roles exigés
    	Set<String> roles = Sets.newHashSet(RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE);
    	// verify
    	Assertions.assertThat(undertest.hasRoles(token, roles)).isFalse();
    }

}
