package org.ourses.server.security.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.security.authentication.AuthcToken;
import org.ourses.security.authentication.AuthcTokenUtil;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.security.domain.dto.AuthenticatedUserDTO;
import org.ourses.server.security.domain.dto.LoginDTO;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.helpers.SecurityHelper;
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
    public Response authentication(LoginDTO loginDto) {
        ResponseBuilder builder;
        try {
            securityHelper.doCredentialsMatch(loginDto.getMail(), loginDto.getPassword());
            AuthcToken authcToken = AuthcTokenUtil.generateAuthcToken(loginDto.getMail(), loginDto.getPassword());
            OurseSecurityToken ourseAuthcToken = new OurseSecurityToken(loginDto.getMail(), authcToken);
            ourseAuthcToken.save();
            // On renvoie à l'utilisateur un DTO comprenant les informations de profil et le token d'authentification
            BearAccount bearAccount = BearAccount.findAuthcUserProperties(loginDto.getMail());
            AuthenticatedUserDTO authcUserDTO = new AuthenticatedUserDTO(bearAccount.getId(), bearAccount.getProfile()
                    .getId(), authcToken.getToken(), bearAccount.getProfile().getPseudo(), bearAccount.getAuthzInfo()
                    .getMainRole(), bearAccount.getProfile().getAvatar().getPath());
            builder = Response.ok(authcUserDTO);
        }
        catch (AuthenticationException e) {
            logger.debug("Erreur d'authentification : login ou mot de passe invalide");
            builder = Response.status(Status.UNAUTHORIZED);
        }
        return builder.build();
    }

    @GET
    @Path("/connected")
    public Response isAuthenticated() {
        return Response.ok().build();
    }

    @POST
    @Path("/logout")
    public Response logout(String token) {
        OurseSecurityToken secToken = OurseSecurityToken.findByToken(token);
        if (secToken != null) {
            secToken.deleteMe();
        }
        return Response.status(Status.NO_CONTENT).build();
    }
}
