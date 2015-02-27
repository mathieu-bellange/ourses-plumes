package org.ourses.server.administration.helpers;

import static org.fest.assertions.Assertions.assertThat;
import static org.mockito.Mockito.when;

import org.apache.shiro.subject.PrincipalCollection;
import org.junit.Test;
import org.mockito.Mockito;
import org.ourses.server.administration.domain.entities.BearAccount;

public class RenewPasswordHelperTest {

    private final RenewPasswordHelperImpl helper = new RenewPasswordHelperImpl();

    @Test
    public void shouldBuildRenewPasswordUrl() {
        String renewPasswordUrl = helper.generateUrlToRenewPassword("host", "toto", "date");
        assertThat(renewPasswordUrl).startsWith("https://host/parametres/compte/renouvellement?id=");
    }

    @Test
    public void shouldGenerateId() {
        BearAccount account = Mockito.mock(BearAccount.class);
        PrincipalCollection principals = Mockito.mock(PrincipalCollection.class);
        when(principals.getPrimaryPrincipal()).thenReturn("toto");
        when(account.getPrincipals()).thenReturn(principals);
        when(account.getRenewPasswordDate()).thenReturn("date");
        String id = helper.generateRenewPasswordId("toto", "date");
        assertThat(helper.isRenewPasswordIdMatch(id, "toto", "date")).isTrue();
    }
}
