package org.ourses.server.administration.util;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.ourses.server.security.util.RolesUtil;

import com.google.common.collect.Sets;


public class ConstantsUtilTest {

	@Test
	public void shouldGetSetOfStringsFromString(){
		String roles = RolesUtil.ADMINISTRATRICE;
		assertThat(RolesUtil.rolesForShiro(roles)).containsOnly(RolesUtil.ADMINISTRATRICE,RolesUtil.REDACTRICE,
				RolesUtil.LECTEUR_LECTRICE);
	}
	
	@Test
	public void shouldGetStringFromSetOfStrings(){
		Set<String> roles = Sets.newHashSet(RolesUtil.REDACTRICE);
		assertThat(RolesUtil.rolesForDb(roles)).isEqualTo(RolesUtil.REDACTRICE);
	}	
}
