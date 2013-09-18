package org.ourses.server.authentication;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.apache.shiro.crypto.hash.Sha256Hash;

/**
 * Matcher qui permet de vérifier que le mot de passe saisi correspond bien au mot de passe sauver
 * 
 * @author mbellang
 * 
 */
public class ReverseCredentialsMatcher extends SimpleCredentialsMatcher {

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        // mdp saisi par l'utilisateur
        String tokenCredentials = charArrayToString(token.getCredentials());
        // mdp réel du compte, le realm envoie un tableau de char
        String accountCredentials = charArrayToString(info.getCredentials());
        return accountCredentials.equals(encryptedPassword(tokenCredentials));
    }

    /**
     * Méthode d'encryptage du mdp d'un compte
     * 
     * @param token
     * @return
     */
    private String encryptedPassword(String token) {
        return new Sha256Hash(StringUtils.reverse(token)).toString();
    }

    private String charArrayToString(Object credentials) {
        return new String((char[]) credentials);
    }
}
