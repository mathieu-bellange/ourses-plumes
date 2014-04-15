package org.ourses.server.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.security.authentication.AuthcToken;
import org.ourses.security.authentication.AuthcTokenUtil;
import org.ourses.server.domain.entities.security.OurseAuthcToken;
import org.ourses.server.security.helpers.SecurityHelper;
import org.ourses.server.security.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Path("/authc")
@Controller
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthenticationResources {

    Logger logger = LoggerFactory.getLogger(AuthenticationResources.class);
    @Autowired
    private SecurityHelper securityHelper;

    @POST
    public Response authentication(@HeaderParam(HttpHeaders.AUTHORIZATION)
    String authorization) {
        ResponseBuilder builder;
        // basic authentication
        try {
            String[] authorizationDecode = SecurityUtil.decodeBasicAuthorization(authorization);
            securityHelper.doCredentialsMatch(authorizationDecode[0], authorizationDecode[1]);
            AuthcToken authcToken = AuthcTokenUtil.generateAuthcToken(authorizationDecode[0], authorizationDecode[1]);
            OurseAuthcToken ourseAuthcToken = OurseAuthcToken.findByLogin(authorizationDecode[0]);
            if (ourseAuthcToken != null) {
                ourseAuthcToken.setToken(authcToken.getToken());
                ourseAuthcToken.setExpirationDate(authcToken.getExpirationDate());
            }
            else {
                ourseAuthcToken = new OurseAuthcToken(authorizationDecode[0], authcToken);
            }
            ourseAuthcToken.save();
            builder = Response.ok(authcToken);
        }
        catch (AuthenticationException e) {
            logger.debug("Erreur d'authentification : login ou mot de passe invalide");
            builder = Response.status(Status.UNAUTHORIZED);
        }
        return builder.build();
    }
}
