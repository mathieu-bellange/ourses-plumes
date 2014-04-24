package org.ourses.server.security.filter;

import static org.fest.assertions.Assertions.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import javax.servlet.http.HttpServletRequest;

import org.joda.time.DateTime;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.helpers.SecurityHelper;

public class OursesAuthenticationFilterTest {

    @Mock
    SecurityHelper helperMock;
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
        // token renvoyé de la base avec login et uen date d'expiratin de 4 jours
        OurseSecurityToken authcToken = new OurseSecurityToken("mathieu", "token", DateTime.now().plusDays(4).toDate());
        when(helperMock.findByToken("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn("token");
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isTrue();
    }

    @Test
    public void shouldNotAllowedAccessAnExpireToken() throws Exception {
        // prepare
        // token renvoyé de la base avec login et une date d'expiration passée
        OurseSecurityToken authcToken = new OurseSecurityToken("mathieu", "token", DateTime.now().minus(1).toDate());
        when(helperMock.findByToken("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn("token");
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isFalse();
    }

    @Test
    public void shouldNotAllowedAccessWithoutToken() throws Exception {
        // prepare
        // token non trouvé en base
        OurseSecurityToken authcToken = null;
        when(helperMock.findByToken("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn("token");
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isFalse();
    }

    @Test
    public void shouldNotAllowedAccessWithoutBasicToken() throws Exception {
        // prepare
        // basic token null
        String httpEncodeToken = null;
        // token non trouvé en base
        OurseSecurityToken authcToken = new OurseSecurityToken("mathieu", "token", DateTime.now().minus(1).toDate());
        when(helperMock.findByToken("token")).thenReturn(authcToken);
        when(helperRequest.getHeader(anyString())).thenReturn(httpEncodeToken);
        assertThat(filter.isAccessAllowed(helperRequest, null, null)).isFalse();
    }
}
