package org.ourses.server.domain.entities.administration;

import static org.fest.assertions.Assertions.assertThat;

import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.exception.EntityIdNull;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.avaje.ebean.Ebean;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class BearAccountTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Test
    public void shouldGetBearAccountDTO() {
        BearAccount bearAccount = new BearAccount("julie.marie@gmail.com", null, new Profile(),0);
        BearAccountDTO bearAccounToVerify = bearAccount.toBearAccountDTO();
        assertThat(bearAccounToVerify).isNotNull();
        assertThat(bearAccounToVerify.getMail()).isEqualTo(
                (String) bearAccount.getAuthcInfo().getPrincipals().getPrimaryPrincipal());
    }

    @Test
    public void shouldCreateProfileWhenCreatingBearAccount() {
    	//Par défaut le pseudo est renseigné et la description peut être nulle
        BearAccount bearAccount = new BearAccount("julie.marie@gmail.com", null, new Profile(),0);
        assertThat(bearAccount.getProfile().getPseudo()).isEqualTo(Profile.DEFAULT_PSEUDO);
    }

    @Test
    public void shouldInsertNewAccount() {
        BearAccount bearAccount = new BearAccount("julie.marie@gmail.com", "SexyJulie",
               new Profile(),0);
        bearAccount.setAuthzInfo(new OursesAuthorizationInfo(1l,RolesUtil.ADMINISTRATRICE));
        Ebean.save(bearAccount);
        assertThat(bearAccount.getId()).isNotNull();
        Ebean.delete(bearAccount);
        assertThat(Ebean.find(BearAccount.class, bearAccount.getId())).isNull();
    }

    @Test
    public void shouldRetrieveListOfAdministrationAccounts() {
        BearAccount bearAccount =new BearAccount("julie.marie@gmail.com", "SexyJulie",
        		 new Profile(),0);
        bearAccount.setAuthzInfo(new OursesAuthorizationInfo(1l,RolesUtil.ADMINISTRATRICE));
        Ebean.save(bearAccount);
        BearAccount bearAccount2 = new BearAccount("julie.marie@gmail.com", "SexyJulie",
        		 new Profile(),0);
        bearAccount2.setAuthzInfo(new OursesAuthorizationInfo(1l,RolesUtil.ADMINISTRATRICE));
        Ebean.save(bearAccount2);
        BearAccount bearAccount3 = new BearAccount("julie.marie@gmail.com", "SexyJulie",
        		 new Profile(),0);
        bearAccount3.setAuthzInfo(new OursesAuthorizationInfo(1l,RolesUtil.ADMINISTRATRICE));
        Ebean.save(bearAccount3);
        List<BearAccount> listBearAccounts = BearAccount.findAllAdministrationBearAccounts();
        // il y a 5 BearAccount en base, 3 ici et 2 insérés par INSERT_ACCOUNT (src/main/resources/META-INF/sql)
        assertThat(listBearAccounts).hasSize(5);
    }
    
    /**
     * Ebean possède un cache transactionnel qui renvoie la même instance tant que la transaction n'est pas finie. 
     * Test la nullité du bean avec un Ebean.refresh
     * 
     * @throws EntityIdNull
     */
    @Test(expected=EntityNotFoundException.class)
    public void shouldDeleteAccount() throws EntityIdNull{
    	BearAccount bearAccount =new BearAccount("julie.marie@gmil.com", "SexyJulie",
        		 new Profile(),0);
    	bearAccount.setAuthzInfo(new OursesAuthorizationInfo(1l,RolesUtil.ADMINISTRATRICE));
        Ebean.save(bearAccount);
        bearAccount.delete();
        Ebean.refresh(bearAccount);
    }
    
    @Test(expected=EntityIdNull.class)
    public void shouldNotDeleteAccountWithIdNull() throws EntityIdNull{
    	BearAccount idNull = new BearAccount();
    	idNull.delete();
    }
}
