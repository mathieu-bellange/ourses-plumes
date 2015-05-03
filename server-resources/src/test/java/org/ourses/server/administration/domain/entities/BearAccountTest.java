package org.ourses.server.administration.domain.entities;

import static org.fest.assertions.Assertions.assertThat;

import java.util.List;

import org.junit.Test;
import org.ourses.server.administration.domain.dto.BearAccountDTO;
import org.ourses.server.administration.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.administration.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.administration.domain.exception.AccountProfileNullException;
import org.ourses.server.picture.domain.entities.Avatar;
import org.ourses.server.security.util.RolesUtil;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;

@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class BearAccountTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Test
    public void shouldGetBearAccountDTO() {
        BearAccount bearAccount = new BearAccount(1l, "julie.marie@gmail.com", "mdp", new Profile(1l, "moi", "test"), 0);
        bearAccount.setAuthzInfo(new OursesAuthorizationInfo(1l, "role"));
        Avatar avatar = new Avatar(0l, "path", null);
        bearAccount.getProfile().setAvatar(avatar);
        BearAccountDTO bearAccounToVerify = bearAccount.toPartialBearAccountDTO();
        assertThat(bearAccounToVerify).isNotNull();
        assertThat(bearAccounToVerify.getProfile()).isNotNull();
        assertThat(bearAccounToVerify.getRole()).isNotNull();
        assertThat(bearAccounToVerify.getPassword()).isNull();
        assertThat(bearAccounToVerify.getMail()).isEqualTo(
                (String) bearAccount.getAuthcInfo().getPrincipals().getPrimaryPrincipal());
        assertThat(bearAccounToVerify.getProfile().getAvatar()).isNotNull();
        assertThat(bearAccounToVerify.getProfile().getAvatar().getPath()).isEqualTo(avatar.getPath());

        // prinicpal ne peut pas être null dans shiro
        bearAccount = new BearAccount(1l, "Principal", null, null, 0);
        // set null après l'instanciation
        bearAccount.setAuthcInfo(null);
        bearAccounToVerify = bearAccount.toPartialBearAccountDTO();
        assertThat(bearAccounToVerify).isNotNull();
        assertThat(bearAccounToVerify.getProfile()).isNull();
        assertThat(bearAccounToVerify.getRole()).isNull();
        assertThat(bearAccounToVerify.getPassword()).isNull();
        assertThat(bearAccounToVerify.getMail()).isNull();
    }

    @Test
    @Rollback
    public void shouldInsertNewAccount() throws AccountProfileNullException, AccountAuthcInfoNullException,
            AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, "julie.marie@gmail.com", "Julie", new Profile(null, "Pseudo",
                ""), 0);
        bearAccount.setAuthzInfo(new OursesAuthorizationInfo(1l, RolesUtil.ADMINISTRATRICE));
        bearAccount.save();
        assertThat(bearAccount.getId()).isNotNull();
        assertThat(bearAccount.getAuthcInfo().getCredentials()).isEqualTo("Julie");
    }

    @Test(expected = AccountProfileNullException.class)
    public void shouldNotInserAccountWithProfileNull() throws AccountProfileNullException,
            AccountAuthcInfoNullException, AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, "julie.marie@gmail.com", "SexyJulie", null, 0);
        bearAccount.save();
    }

    @Test(expected = AccountProfileNullException.class)
    public void shouldNotInserAccountWithPseudoNull() throws AccountProfileNullException,
            AccountAuthcInfoNullException, AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, "julie.marie@gmail.com", "SexyJulie", new Profile(null, null,
                ""), 0);
        bearAccount.save();
    }

    @Test(expected = AccountAuthcInfoNullException.class)
    public void shouldNotInserAccountWithAuthcNull() throws AccountProfileNullException, AccountAuthcInfoNullException,
            AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, "julie.marie@gmail.com", "SexyJulie", new Profile(null,
                "Pseudo", ""), 0);
        bearAccount.setAuthcInfo(null);
        bearAccount.save();
    }

    @Test(expected = AccountAuthcInfoNullException.class)
    public void shouldNotInserAccountWithPasswordNull() throws AccountProfileNullException,
            AccountAuthcInfoNullException, AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, "julie.marie@gmail.com", null, new Profile(null, "Pseudo", ""),
                0);
        bearAccount.save();
    }

    @Test(expected = AccountAuthzInfoNullException.class)
    public void shouldNotInserAccountWithRoleNull() throws AccountProfileNullException, AccountAuthcInfoNullException,
            AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, "julie.marie@gmail.com", "SexyJulie", new Profile(null,
                "Pseudo", ""), 0);
        bearAccount.save();
    }

    @Test(expected = AccountAuthcInfoNullException.class)
    public void shouldNotInserAccountWithMailNull() throws AccountProfileNullException, AccountAuthcInfoNullException,
            AccountAuthzInfoNullException {
        BearAccount bearAccount = new BearAccount(null, null, "SexyJulie", new Profile(null, "Pseudo", ""), 0);
        bearAccount.save();
    }

    @Test
    public void shouldRetrieveListOfAdministrationAccounts() {
        List<BearAccount> listBearAccounts = BearAccount.findAllAdministrationBearAccounts();
        assertThat(listBearAccounts).isNotEmpty();
        // vérifie que l'on a bien les informations du comptes id, authorizationInfo et AuthenticationInfo
        assertThat(listBearAccounts).onProperty("id").isNotNull();
        assertThat(listBearAccounts).onProperty("authcInfo").isNotNull();
        assertThat(listBearAccounts).onProperty("authzInfo").isNotNull();
        assertThat(listBearAccounts).onProperty("profile").isNotNull();
    }

    @Test
    @Rollback
    public void shouldUpdateAccount() {
        BearAccount account = BearAccount.findAdminAccount(1l);
        assertThat(account.getProfile()).isNotNull();
    }
}
