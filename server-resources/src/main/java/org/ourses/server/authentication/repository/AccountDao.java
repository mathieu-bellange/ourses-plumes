package org.ourses.server.authentication.repository;

import java.util.Set;

/**
 * Interface du DAO gérant les comptes
 * 
 * @author Mathieu
 *
 */
public interface AccountDao {
	
	String getPassword(String username);

    Set<String> getRoles(String username);

    Set<String> getPermissions(String username);

}
