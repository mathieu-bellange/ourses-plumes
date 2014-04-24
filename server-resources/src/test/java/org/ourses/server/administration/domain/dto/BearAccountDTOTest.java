package org.ourses.server.administration.domain.dto;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.ourses.server.administration.domain.dto.BearAccountDTO;
import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.security.util.RolesUtil;

public class BearAccountDTOTest {

    @Test
    public void shouldGetBearAccount() {
        BearAccountDTO bearAccountDTO = new BearAccountDTO();
        ProfileDTO profileDTO = new ProfileDTO();
        profileDTO.setDescription("blabla");
        bearAccountDTO.setMail("ourses@mail.com");
        bearAccountDTO.setPassword("password");
        profileDTO.setPseudo("ourses");
        bearAccountDTO.setProfile(profileDTO);
        String role = RolesUtil.LECTEUR_LECTRICE;
        bearAccountDTO.setRole(new OursesAuthzInfoDTO(role));
        BearAccount bearAccount = bearAccountDTO.toBearAccount();

        assertThat(bearAccount).isNotNull();
        assertThat(bearAccount.getProfile().getPseudo()).isEqualTo(bearAccountDTO.getProfile().getPseudo());
        assertThat(bearAccount.getProfile().getDescription()).isEqualTo(bearAccountDTO.getProfile().getDescription());
        assertThat(bearAccount.getRoles()).containsOnly(RolesUtil.LECTEUR_LECTRICE);
        assertThat(bearAccount.getPrincipals().getPrimaryPrincipal()).isEqualTo(bearAccountDTO.getMail());
        assertThat(bearAccount.getCredentials()).isEqualTo(bearAccountDTO.getPassword());
    }

}
