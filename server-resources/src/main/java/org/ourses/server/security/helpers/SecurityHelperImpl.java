package org.ourses.server.security.helpers;

import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.web.util.WebUtils;
import org.ourses.security.util.SecurityUtility;
import org.ourses.server.authentication.helpers.BearAccountHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Strings;
import com.google.common.net.HttpHeaders;

@Component
public class SecurityHelperImpl implements SecurityHelper {

    Logger logger = LoggerFactory.getLogger(SecurityHelperImpl.class);
    @Autowired
    private BearAccountHelper accountDao;

    private static final String WWW_AUTHENTICATE_VALUE = "Basic realm=\"oursesRealm\"";

    @Override
    public void doCredentialsMatch(String login, String password) throws AuthenticationException {
        // vérification de l'user name
        checkNotNull(login, "Null usernames are not allowed by this realm.");

        // vérification du password
        checkNotNull(password, "No account found for user [" + login + "]");

        String username_password = accountDao.getPassword(login);
        if (!username_password.equals(SecurityUtility.encryptedPassword(password))) {
            throw new AuthenticationException();
        }
    }

    private void checkNotNull(String reference, String message) {
        if (Strings.isNullOrEmpty(reference)) {
            throw new AuthenticationException(message);
        }
    }

    @Override
    public void sendChallenge(ServletResponse response) {
        logger.debug("Authentication required: sending 401 Authentication challenge response.");
        HttpServletResponse httpResponse = WebUtils.toHttp(response);
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.setHeader(HttpHeaders.WWW_AUTHENTICATE, WWW_AUTHENTICATE_VALUE);
    }

    @Override
    public ResponseBuilder sendChallenge() {
        logger.debug("Authentication required: sending 401 Authentication challenge response.");
        return Response.status(Status.UNAUTHORIZED).header(HttpHeaders.WWW_AUTHENTICATE, WWW_AUTHENTICATE_VALUE);
    }

    @VisibleForTesting
    protected void setAccountDao(BearAccountHelper accountDao) {
        this.accountDao = accountDao;
    }

}
