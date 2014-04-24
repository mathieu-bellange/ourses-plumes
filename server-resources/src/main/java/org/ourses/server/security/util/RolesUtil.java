package org.ourses.server.security.util;

import java.util.Set;

import javax.annotation.Nonnull;

import com.google.common.collect.Sets;

public final class RolesUtil {

    public static final String ADMINISTRATRICE = "Administratrice";
    public static final String REDACTRICE = "Rédactrice";
    public static final String LECTEUR_LECTRICE = "Lecteur/Lectrice";

    /**
     *Seul le rôle le plus habilité est conservé en base de données
     * */
    @Nonnull
    public static String rolesForDb(@Nonnull
    Set<String> roles) {
        String roleDb = LECTEUR_LECTRICE;
        if(roles.contains(ADMINISTRATRICE)){
        	roleDb = ADMINISTRATRICE;
        }else if(roles.contains(REDACTRICE)){
        	roleDb = REDACTRICE;
        }
        return roleDb;
    }

    /**
     * Seul le rôle le plus habilité est conservé en base de données, on ajoute les rôles 
     * supplémentaires pour Shiro
     * */
    @Nonnull
    public static Set<String> rolesForShiro(@Nonnull
    String role) {
        Set<String> roles = Sets.newHashSet();
        roles.add(role);
        if(role.equals(ADMINISTRATRICE)) {
            roles.add(REDACTRICE);
        }
        if(!role.equals(LECTEUR_LECTRICE)){
        	roles.add(LECTEUR_LECTRICE);
        }
        return roles;
    }
}
