package org.ourses.server.authentication.filter;

import static org.fest.assertions.Assertions.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.codec.Base64;
import org.joda.time.DateTime;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.ourses.server.authentication.helpers.OursesAuthenticationHelper;
import org.ourses.server.domain.entities.security.OurseAuthcToken;

public class OursesAuthenticationFilterTest {

    @Mock
    OursesAuthenticationHelper helperMock;
    @Mock
    HttpServletRequest helperRequest;
    OursesAuthenticationFilter filter = new OursesAuthenticationFilter();

    public OursesAuthenticationFilterTest() {
        MockitoAnnotations.initMocks(this);
        filter.setHelper(helperMock);
    }

    @Test
    public void shouldAllowedAccess() throws Exception {
        // prepare
        // encryptage du token pour le http header
        String encodeToken = Base64.encodeToString("token".getBytes());
        // ajout "Basic " pour le http header
        String httpEncodeToken = "Basic " + encodeToken;
        // token renvoyé de la base avec login et uen date d'expiratin de 4 jours
        OurseAuthcToken authcToken = new OurseAuthcToken("mathieu", "token", DateTime.now().plusDays(4).toDate());
        when(helperMock.find("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn(httpEncodeToken);
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isTrue();
    }

    @Test
    public void shouldNotAllowedAccessAnExpireToken() throws Exception {
        // prepare
        // encryptage du token pour le http header
        String encodeToken = Base64.encodeToString("token".getBytes());
        // ajout "Basic " pour le http header
        String httpEncodeToken = "Basic " + encodeToken;
        // token renvoyé de la base avec login et une date d'expiration passée
        OurseAuthcToken authcToken = new OurseAuthcToken("mathieu", "token", DateTime.now().minus(1).toDate());
        when(helperMock.find("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn(httpEncodeToken);
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isFalse();
    }

    @Test
    public void shouldNotAllowedAccessWithoutToken() throws Exception {
        // prepare
        // encryptage du token pour le http header
        String encodeToken = Base64.encodeToString("token".getBytes());
        // ajout "Basic " pour le http header
        String httpEncodeToken = "Basic " + encodeToken;
        // token non trouvé en base
        OurseAuthcToken authcToken = null;
        when(helperMock.find("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn(httpEncodeToken);
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isFalse();
    }

    @Test
    public void shouldNotAllowedAccessWithoutBasicToken() throws Exception {
        // prepare
        // basic token null
        String httpEncodeToken = null;
        // token non trouvé en base
        OurseAuthcToken authcToken = new OurseAuthcToken("mathieu", "token", DateTime.now().minus(1).toDate());
        when(helperMock.find("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn(httpEncodeToken);
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isFalse();
    }
}
