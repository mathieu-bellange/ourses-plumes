package org.ourses.server.security.filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.util.WebUtils;
import org.joda.time.DateTime;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.helpers.SecurityHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.net.HttpHeaders;

public class OursesAuthenticationFilter extends AccessControlFilter {

    Logger logger = LoggerFactory.getLogger(OursesAuthenticationFilter.class);

    @Autowired
    private SecurityHelper helper;

    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue)
            throws Exception {
        boolean isAuthenticated = false;
        // token est dans le header
        String token = getAuthzHeader(request);
        logger.info("Access token : {}", token);
        if (token != null) {
            // recherche si le token en base existe bien
            OurseSecurityToken authToken = helper.findByToken(token);
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
        httpResponse.addHeader("Content-Type", "application/json;charset=UTF-8");
        httpResponse.getWriter().write("{\"error\" : \"Unauthorized\"}");
        return false;
    }

    private String getAuthzHeader(ServletRequest request) {
        HttpServletRequest httpRequest = WebUtils.toHttp(request);
        return httpRequest.getHeader(HttpHeaders.AUTHORIZATION);
    }

    @VisibleForTesting
    protected void setHelper(SecurityHelper helper) {
        this.helper = helper;
    }

}
