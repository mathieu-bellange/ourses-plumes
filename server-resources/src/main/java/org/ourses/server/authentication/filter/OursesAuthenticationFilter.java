package org.ourses.server.authentication.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.joda.time.DateTime;
import org.ourses.server.authentication.helpers.OursesAuthenticationHelper;
import org.ourses.server.domain.entities.security.OurseAuthcToken;
import org.ourses.server.security.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.net.HttpHeaders;

public class OursesAuthenticationFilter extends AccessControlFilter {

    Logger logger = LoggerFactory.getLogger(OursesAuthenticationFilter.class);

    @Autowired
    private OursesAuthenticationHelper helper;

    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue)
            throws Exception {
        boolean isAuthenticated = false;
        // token est dans la partie login de l'auth Basic
        String basicToken = getAuthzHeader(request);
        logger.info("Access token : {}", basicToken);
        if (basicToken != null) {
            String token = SecurityUtil.decodeBasicAuthorization(getAuthzHeader(request))[0];
            // recherche si le token en base existe bien
            OurseAuthcToken authToken = helper.findByToken(token);
            if (authToken != null && new DateTime(authToken.getExpirationDate()).isAfterNow()) {
                isAuthenticated = true;
            }
        }
        logger.info("Authenticated : {}", isAuthenticated);
        return isAuthenticated;
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        logger.info("envoi une erreur 401");
        HttpServletResponse httpResponse = WebUtils.toHttp(response);
        httpResponse.setStatus(Status.UNAUTHORIZED.getStatusCode());
        httpResponse.setHeader("resource-requested", getResourceRequested(request));
        return false;
    }

    private String getAuthzHeader(ServletRequest request) {
        HttpServletRequest httpRequest = WebUtils.toHttp(request);
        return httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
    }

    private String getResourceRequested(ServletRequest request) {
        HttpServletRequest httpRequest = WebUtils.toHttp(request);
        return httpRequest.getRequestURI();
    }

    @VisibleForTesting
    protected void setHelper(OursesAuthenticationHelper helper) {
        this.helper = helper;
    }

}
