package org.ourses.server.domain.entities.administration;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.domain.jsondto.administration.OursesAuthzInfoDTO;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class OursesAuthzInfoTest {

	@Test
    public void shouldGetOursesAuthzInfoDTO() {
		OursesAuthorizationInfo oursesAuthorizationInfo = new OursesAuthorizationInfo();
		oursesAuthorizationInfo.setRolesForDb("ADMINISTRATRICE");
		oursesAuthorizationInfo.setId(1L);
		OursesAuthzInfoDTO oursesAuthzInfoToVerify = oursesAuthorizationInfo.toOursesAuthzInfoDTO();
		//Un role ne peut pas être en double
        assertThat(oursesAuthzInfoToVerify.getRole()).isEqualTo(oursesAuthorizationInfo.getRolesForDb());
    }

    @Test
    public void shouldRetrieveSetsOfOursesAuthorizationInfo() {
        Set<OursesAuthorizationInfo> roles = OursesAuthorizationInfo.findAllRoles();
        // ATTENTION données en base
        assertThat(roles).onProperty("rolesForDb").containsOnly("Administratrice", "Rédactrice");
    }
}
