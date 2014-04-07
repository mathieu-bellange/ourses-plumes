package org.ourses.server.authentication.util;

import java.util.Set;

import org.ourses.server.authentication.helpers.BearAccountHelper;

import com.google.common.collect.Sets;

public class BearAccountHelperTestImpl implements BearAccountHelper {

    @Override
    public String getPassword(String username) {
        if (username.equals("Mathieu")) {
            return "894633f005692bea4e846b65ecafca0baba005cf28d653b79e24de0a5d5cd170";
        }
        return null;
    }

    @Override
    public Set<String> getRoles(String username) {
        if (username.equals("Mathieu")) {
            return Sets.newHashSet("ADMINISTRATRICE");
        }
        return null;
    }

    @Override
    public Set<String> getPermissions(String username) {
        if (username.equals("Mathieu")) {
            return Sets.newHashSet("safe:*");
        }
        return null;
    }

    @Override
    public boolean isNewPseudo(String pseudo) {
        return false;
    }

    @Override
    public boolean isNewMail(String mail) {
        return false;
    }

    @Override
    public boolean isMailValid(String mail) {
        return false;
    }

}
