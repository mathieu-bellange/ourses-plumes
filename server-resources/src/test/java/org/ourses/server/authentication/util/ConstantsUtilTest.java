package org.ourses.server.authentication.util;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;

import com.google.common.collect.Sets;


public class ConstantsUtilTest {

	@Test
	public void shouldGetSetOfStringsFromString(){
		String roles = "ADMINISTRATRICE,REDACTRICE";
		assertThat(RolesUtil.rolesForShiro(roles)).containsOnly("ADMINISTRATRICE","REDACTRICE");
	}
	
	@Test
	public void shouldGetStringFromSetOfStrings(){
		Set<String> roles = Sets.newHashSet("ADMINISTRATRICE","REDACTRICE");
		assertThat(RolesUtil.rolesForDb(roles)).isEqualTo("ADMINISTRATRICE,REDACTRICE");
	}	
}
