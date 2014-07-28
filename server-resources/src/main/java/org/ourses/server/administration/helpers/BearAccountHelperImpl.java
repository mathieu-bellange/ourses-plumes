package org.ourses.server.administration.helpers;

import java.util.Set;

import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.entities.OursesAuthenticationInfo;
import org.ourses.server.administration.domain.entities.OursesAuthorizationInfo;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.administration.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.administration.domain.exception.AccountProfileNullException;
import org.ourses.server.administration.util.BearAccountUtil;
import org.ourses.server.security.helpers.SecurityHelper;
import org.ourses.server.security.util.RolesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.base.Strings;
import com.google.common.collect.Sets;

@Component
public class BearAccountHelperImpl implements BearAccountHelper {

    @Autowired
    private SecurityHelper securityHelper;

    @Autowired
    private ProfileHelper profileHelper;

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
    public boolean isNewPseudo(String pseudo) {
        return Profile.countPseudo(pseudo) == 0;
    }

    @Override
    public boolean isNewMail(String mail) {
        return OursesAuthenticationInfo.countMail(mail) == 0;
    }

    @Override
    public boolean isMailValid(String mail) {
        return !Strings.isNullOrEmpty(mail) && BearAccountUtil.mailPattern.matcher(mail).matches();
    }

    @Override
    public boolean isPseudoValid(String pseudo) {
        return !Strings.isNullOrEmpty(pseudo);
    }

    @Override
    public boolean isPasswordValid(String password) {
        return !Strings.isNullOrEmpty(password) && BearAccountUtil.passwordPattern.matcher(password).matches();
    }

    @Override
    public BearAccount create(BearAccount account) throws AccountProfileNullException, AccountAuthcInfoNullException,
            AccountAuthzInfoNullException {
        account.setCredentials(securityHelper.encryptedPassword((String) account.getCredentials()));
        account.setAuthzInfo(OursesAuthorizationInfo.findRoleByName(RolesUtil.REDACTRICE));
        profileHelper.buildProfilePath(account.getProfile());
        account.save();
        return account;
    }

}
