package org.ourses.server.security.helpers;

import org.apache.shiro.authc.AuthenticationException;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.ourses.security.util.SecurityUtility;
import org.ourses.server.authentication.helpers.BearAccountHelper;

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

}
