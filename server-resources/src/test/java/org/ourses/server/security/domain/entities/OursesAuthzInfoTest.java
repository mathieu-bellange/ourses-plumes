package org.ourses.server.security.domain.entities;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.administration.domain.entities.OursesAuthorizationInfo;
import org.ourses.server.security.util.RolesUtil;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class OursesAuthzInfoTest {

    @Test
    public void shouldGetOursesAuthzInfoDTO() {
        OursesAuthorizationInfo oursesAuthorizationInfo = new OursesAuthorizationInfo();
        oursesAuthorizationInfo.setMainRole(RolesUtil.ADMINISTRATRICE);
        oursesAuthorizationInfo.setId(1L);
        OursesAuthzInfoDTO oursesAuthzInfoToVerify = oursesAuthorizationInfo.toOursesAuthzInfoDTO();
        // Un role ne peut pas être en double
        assertThat(oursesAuthzInfoToVerify.getRole()).isEqualTo(oursesAuthorizationInfo.getMainRole());
    }

    @Test
    public void shouldRetrieveSetsOfOursesAuthorizationInfo() {
        Set<OursesAuthorizationInfo> roles = OursesAuthorizationInfo.findAllRoles();
        // ATTENTION données en base
        assertThat(roles).onProperty("mainRole").containsOnly(RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE);
    }
}
