package org.ourses.server.authentication.helpers;

import java.util.Set;

/**
 * Interface du DAO gérant les comptes
 * 
 * @author Mathieu
 *
 */
public interface BearAccountHelper {
	
	String getPassword(String username);

    Set<String> getRoles(String username);

    Set<String> getPermissions(String username);
    
    boolean isNewPseudo(String pseudo);

}
