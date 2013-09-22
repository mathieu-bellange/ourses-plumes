package org.ourses.server.authentication;


import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.authentication.util.ConstantsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.google.common.collect.Sets;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class BearAccountTest extends AbstractTransactionalJUnit4SpringContextTests {
	
	@Autowired
	private EbeanServer ebeanServer;
	
	@Test
	public void shouldCreateProfileWhenCreatingBearAccount(){		
		BearAccount bearAccount = new BearAccount("julie.marie@gmail.com",null, "staticRealm", null);
		assertThat(bearAccount.getProfile()).as("Le profil est créé en même temps que le compte et ne doit pas être nuls").isNotNull();
	}
	
	@Test
	public void shouldInsertNewAccount(){
		BearAccount bearAccount = new BearAccount("julie.marie@gmail.com","SexyJulie", "staticRealm", Sets.newHashSet(ConstantsUtil.ADMINISTRATRICE,ConstantsUtil.REDACTRICE));
		Ebean.save(bearAccount);
		assertThat(bearAccount.getId()).isNotNull();
	}
}
