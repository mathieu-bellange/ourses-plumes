package org.ourses.server.authentication.util;

import java.util.Set;

import javax.annotation.Nonnull;

import com.google.common.collect.Sets;

public final class RolesUtil {

	public static String ADMINISTRATRICE = "Administratrice";
	public static String REDACTRICE = "Rédactrice";
	public static String LECTEUR_LECTRICE = "Lecteur/Lectrice";
	
	/**
	 * Mapping d'un set de roles issu de Shiro sur une String
	 * pour sa sauvegarde en base de données par Ebean (les sets
	 * de String ne sont pas supportés par JPA 1.0)
	 * */
	@Nonnull
	public static String rolesForDb(@Nonnull Set<String> roles){
		StringBuilder roleDb = new StringBuilder();
		for(String role : roles){
			roleDb.append(role);
			roleDb.append(",");
		}
		roleDb.replace(roleDb.length()-1, roleDb.length(), "");
		
		return roleDb.toString();
	}
	
	/**
	 * Mapping d'une String (concatenation des roles séparés par une virgule)
	 * venant de la base données sur un set de roles pour Shiro
	 * (les sets de String ne sont pas supportés par JPA 1.0)
	 * */
	@Nonnull
	public static Set<String> rolesForShiro(@Nonnull String role){
		Set<String> roles = Sets.newHashSet();
		for (String r : role.split(",")){
			roles.add(r);
		}
		return roles;
	}
}
