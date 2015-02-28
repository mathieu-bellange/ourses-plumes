package org.ourses.server.administration.helpers;

import java.util.Date;
import java.util.Set;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.entities.OursesAuthenticationInfo;
import org.ourses.server.administration.domain.entities.OursesAuthorizationInfo;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.administration.domain.exception.AccountAuthzInfoNullException;
import org.ourses.server.administration.domain.exception.AccountProfileNullException;
import org.ourses.server.administration.util.BearAccountUtil;
import org.ourses.server.newsletter.helper.MailHelper;
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

    @Autowired
    private RenewPasswordHelper renewPasswordHelper;
    
    @Autowired
    private MailHelper mailHelper;

    @Override
    public String getPassword(final String username) {
        return BearAccount.getBearAccountCredentials(username);
    }

    @Override
    public Set<String> getRoles(final String username) {
        return BearAccount.getBearAccountRoles(username);
    }

    @Override
    public Set<String> getPermissions(final String username) {
        return Sets.newHashSet();
    }

    @Override
    public boolean isNewPseudo(final String pseudo, final Long id) {
        boolean isNewPseudo = false;
        if (id != null) {
            isNewPseudo = Profile.countPseudo(profileHelper.beautifyPseudo(pseudo), id) == 0;
        }
        else {
            isNewPseudo = Profile.countPseudo(profileHelper.beautifyPseudo(pseudo)) == 0;
        }
        return isNewPseudo;
    }

    @Override
    public boolean isNewMail(final String mail) {
        return OursesAuthenticationInfo.countMail(mail) == 0;
    }

    @Override
    public boolean isPseudoValid(final String pseudo) {
        return !Strings.isNullOrEmpty(pseudo);
    }

    @Override
    public boolean isPasswordValid(final String password) {
        return !Strings.isNullOrEmpty(password) && BearAccountUtil.passwordPattern.matcher(password).matches();
    }

    @Override
    public BearAccount create(final BearAccount account) throws AccountProfileNullException,
            AccountAuthcInfoNullException, AccountAuthzInfoNullException {
        account.setCredentials(securityHelper.encryptedPassword((String) account.getCredentials()));
        account.setAuthzInfo(OursesAuthorizationInfo.findRoleByName(RolesUtil.REDACTRICE));
        profileHelper.buildProfilePath(account.getProfile());
        profileHelper.addDefaultAvatar(account.getProfile());
        account.save();
        return account;
    }

    @Override
    public void resetAccountPassword(final String host, final String mail) {
        BearAccount bearAccount = BearAccount.findAuthcUserProperties(mail);
        if (bearAccount != null) {
            bearAccount.setRenewPasswordDate(DateTime.now().plusHours(1).toString(DateTimeFormat.forPattern("dd/MM/yyyy HH:mm:ss")));
            String renewUrl = renewPasswordHelper.generateUrlToRenewPassword(host, mail, bearAccount.getRenewPasswordDate());
            mailHelper.renewPassword(renewUrl, mail);
            bearAccount.update("renewPasswordDate");
        }

    }

	@Override
	public boolean renewPassword(String mail, String id, String password) {
		BearAccount bearAccount = BearAccount.findAuthcUserProperties(mail);
		boolean isOk = false;
		DateTime renewPasswordDate = DateTimeFormat.forPattern("dd/MM/yyyy HH:mm:ss").parseDateTime(bearAccount.getRenewPasswordDate());
		Long now = new DateTime().getMillis();
		if (bearAccount != null && renewPasswordDate.isAfter(now)) {
			isOk = renewPasswordHelper.isRenewPasswordIdMatch(id, mail, bearAccount.getRenewPasswordDate());
			if(isOk){
				bearAccount.setCredentials(securityHelper.encryptedPassword(password));
				bearAccount.updateCredentials();
			} 
		}
		return isOk;
	}
}
