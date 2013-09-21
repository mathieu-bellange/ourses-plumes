package org.ourses.server.authentication;


import org.junit.Test;
import static org.fest.assertions.Assertions.assertThat;

public class BearAccountTest {
	
	@Test
	public void shouldCreateProfileWhenCreatingBearAccount(){		
		BearAccount bearAccount = new BearAccount("julie.marie@gmail.com",null, "staticRealm", null,null);
		assertThat(bearAccount.getProfile()).as("Le profil est créé en même temps que le compte et ne doit pas être nuls").isNotNull();
	}
}
