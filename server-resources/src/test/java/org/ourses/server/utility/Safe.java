package org.ourses.server.utility;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.shiro.crypto.hash.Sha256Hash;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.collect.HashMultimap;

/**
 * Classe présente que pour les Tests
 * 
 * @author mbellang
 * 
 */
@VisibleForTesting
public class Safe {
    static Map<String, String> passwords = new HashMap<String, String>();
    static HashMultimap<String, String> permissions = HashMultimap.create();
    static HashMultimap<String, String> roles = HashMultimap.create();

    static {
        passwords.put("pierre", encrypt("vert"));
        passwords.put("paul", encrypt("bleu"));
        permissions.put("pierre", "safe:*");
        roles.put("pierre", "vip");
    }

    private static String encrypt(String password) {
        return new Sha256Hash(password).toString();
    }

    public static String getPassword(String username) {
        return passwords.get(username);
    }

    public static Set<String> getRoles(String username) {
        return roles.get(username);
    }

    public static Set<String> getPermissions(String username) {
        return permissions.get(username);
    }
}
