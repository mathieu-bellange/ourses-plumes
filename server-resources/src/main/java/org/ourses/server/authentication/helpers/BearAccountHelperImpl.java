package org.ourses.server.authentication.helpers;

import java.util.Set;

import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.entities.administration.Profile;
import org.springframework.stereotype.Component;

import com.google.common.collect.Sets;

@Component
public class BearAccountHelperImpl implements BearAccountHelper {

    @Override
    public String getPassword(String username) {
        return BearAccount.getBearAccountCredentials(username);
    }

    @Override
    public Set<String> getRoles(String username) {
        return BearAccount.getBearAccountRoles(username);
    }

    @Override
    public Set<String> getPermissions(String username) {
        return Sets.newHashSet();
    }

	@Override
	public boolean isNewPseudo(String pseudo){
		return Profile.countPseudo(pseudo) == 0;
	}

}
