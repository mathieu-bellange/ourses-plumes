package org.ourses.server.utility;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.crypto.hash.Sha256Hash;
import org.ourses.server.authentication.AccountDao;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.HashMultimap;

/**
 * Classe présente que pour les Tests
 * 
 * @author mbellang
 * 
 */
@VisibleForTesting
public class Safe implements AccountDao{
    Map<String, String> passwords = new HashMap<String, String>();
    HashMultimap<String, String> permissions = HashMultimap.create();
    HashMultimap<String, String> roles = HashMultimap.create();

    public Safe() {
        passwords.put("pierre", encrypt("vert"));
        passwords.put("paul", encrypt("bleu"));
        passwords.put("Mathieu", "894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170");
        permissions.put("pierre", "safe:*");
        permissions.put("Mathieu", "safe:*");
        roles.put("Mathieu", "Admin");
        roles.put("pierre", "vip");
    }

    private static String encrypt(String password) {
        return new Sha256Hash(password).toString();
    }

    public String getPassword(String username) {
        return passwords.get(username);
    }

    public Set<String> getRoles(String username) {
        return roles.get(username);
    }

    public Set<String> getPermissions(String username) {
        return permissions.get(username);
    }
}
