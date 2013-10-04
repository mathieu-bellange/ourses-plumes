package org.ourses.server.domain.entities.administration;

import static org.fest.assertions.Assertions.assertThat;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.authentication.util.RolesUtil;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.avaje.ebean.Ebean;
import com.google.common.collect.Sets;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class BearAccountTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Test
    public void shouldCreateProfileWhenCreatingBearAccount() {
        BearAccount bearAccount = new BearAccount("julie.marie@gmail.com", null, null, new Profile());
        assertThat(bearAccount.getProfile().getPseudo()).isEqualTo(Profile.DEFAULT_PSEUDO);
    }

    @Test
    public void shouldInsertNewAccount() {
        BearAccount bearAccount = new BearAccount("julie.marie@gmail.com", "SexyJulie", Sets.newHashSet(
                RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE), new Profile());
        Ebean.save(bearAccount);
        assertThat(bearAccount.getId()).isNotNull();
        Ebean.delete(bearAccount);
        assertThat(Ebean.find(BearAccount.class, bearAccount.getId())).isNull();
    }

    @Test
    public void shouldRetrieveListOfAccounts() {
        BearAccount bearAccount = new BearAccount("julie.marie@gmail.com", "SexyJulie", Sets.newHashSet(
                RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE), new Profile());
        Ebean.save(bearAccount);
        BearAccount bearAccount2 = new BearAccount("julie.marie@gmail.com", "SexyJulie", Sets.newHashSet(
                RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE), new Profile());
        Ebean.save(bearAccount2);
        BearAccount bearAccount3 = new BearAccount("julie.marie@gmail.com", "SexyJulie", Sets.newHashSet(
                RolesUtil.ADMINISTRATRICE, RolesUtil.REDACTRICE), new Profile());
        Ebean.save(bearAccount3);
        List<BearAccount> listBearAccounts = Ebean.find(BearAccount.class).findList();
        assertThat(listBearAccounts).hasSize(3);
    }
}
