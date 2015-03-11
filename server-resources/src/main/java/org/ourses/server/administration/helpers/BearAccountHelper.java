package org.ourses.server.administration.helpers;

import java.util.Set;

import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.administration.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.administration.domain.exception.AccountProfileNullException;

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

    boolean isNewPseudo(String pseudo, Long profileId);

    boolean isNewMail(String mail);

    boolean isPseudoValid(String pseudo);

    boolean isPasswordValid(String password);

    BearAccount create(BearAccount account) throws AccountProfileNullException, AccountAuthcInfoNullException,
            AccountAuthzInfoNullException;

    boolean renewPassword(String mail, String id, String password);

    void resetAccountPassword(String mail);

    boolean delete(long id, boolean deleteArticles);

}
