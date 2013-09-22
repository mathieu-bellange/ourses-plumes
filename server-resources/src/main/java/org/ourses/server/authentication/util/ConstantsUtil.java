package org.ourses.server.authentication.util;

import java.util.Set;

import com.google.common.base.Strings;
import com.google.common.collect.Sets;

public final class ConstantsUtil {

	public static String ADMINISTRATRICE = "Administratrice";
	public static String REDACTRICE = "Rédactrice";
	public static String LECTEUR_LECTRICE = "Lecteur/Lectrice";
	
	public static String rolesForDb(Set<String> roles){
		StringBuilder roleDb = new StringBuilder();
		if (roles != null && !roles.isEmpty()){
			for(String role : roles){
				roleDb.append(role);
				roleDb.append(",");
			}
			roleDb.replace(roleDb.length()-1, roleDb.length(), "");
		}
		return roleDb.toString();
	}
	
	public static Set<String> rolesForShiro(String role){
		Set<String> roles = Sets.newHashSet();
		if (!Strings.isNullOrEmpty(role)){
			for (String r : role.split(",")){
				roles.add(r);
			}
		}
		return roles;
	}
}
