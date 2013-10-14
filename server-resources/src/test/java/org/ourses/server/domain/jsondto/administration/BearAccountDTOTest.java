package org.ourses.server.domain.jsondto.administration;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.ourses.server.domain.entities.administration.BearAccount;

import com.google.common.collect.Sets;

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
        Set<String> roles = Sets.newHashSet("1");
        bearAccountDTO.setRoles(roles);
        BearAccount bearAccount = bearAccountDTO.toBearAccount();

        assertThat(bearAccount).isNotNull();
        assertThat(bearAccount.getProfile().getPseudo()).isEqualTo(bearAccountDTO.getProfile().getPseudo());
        assertThat(bearAccount.getProfile().getDescription()).isEqualTo(bearAccountDTO.getProfile().getDescription());
        assertThat(bearAccount.getRoles()).containsOnly("1");
        assertThat(bearAccount.getPrincipals().getPrimaryPrincipal()).isEqualTo(bearAccountDTO.getMail());
        assertThat(bearAccount.getCredentials()).isEqualTo(bearAccountDTO.getPassword());
    }

}
