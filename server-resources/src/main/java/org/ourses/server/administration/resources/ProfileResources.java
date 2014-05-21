package org.ourses.server.administration.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.helpers.ProfileHelper;
import org.ourses.server.administration.util.SocialLinkUtil;
import org.ourses.server.security.helpers.SecurityHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.net.HttpHeaders;

@Controller
@Path("/profile")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProfileResources {

    @Autowired
    private SecurityHelper securityHelper;
    @Autowired
    private ProfileHelper profileHelper;

    @GET
    @Path("/{id}")
    public Response getProfile(@PathParam("id")
    long id) {
        Profile profile = Profile.findProfileWithSocialLinks(id);
        ResponseBuilder builder;
        if (profile == null) {
            builder = Response.serverError();
        }
        else {
            builder = Response.ok().entity(profile.toProfileDTO());
        }
        return builder.build();
    }

    @PUT
    @Path("/{id}")
    public Response updateProfile(@PathParam("id")
    Long id, CoupleDTO coupleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {

        BearAccount bearAccount = BearAccount.findAdminAccountByProfileId(id);
        ResponseBuilder builder;
        if (bearAccount == null) {
            builder = Response.serverError();
        }
        else {
            try {
                // vérification que le compte a récupéré est bien réalisé par l'utilisateur authentifié
                securityHelper.checkAuthenticatedUser(bearAccount.getAuthcInfo().getMail(), token);

                Profile profile = Profile.findProfileWithSocialLinks(id);
                if (profileHelper.updateProfileProperty(profile, coupleDTO)) {
                    // maj des liens sociaux
                    if (SocialLinkUtil.NETWORK.contains(coupleDTO.getProperty())) {
                        System.out.println(profile.toString());
                        profile.updateProfileProperty("socialLink");
                        System.out.println(profile.toString());
                    }
                    // maj d'une propriété du profil
                    else {
                        profile.updateProfileProperty(coupleDTO.getProperty());
                    }
                }
                builder = Response.status(Status.NO_CONTENT);
            }
            catch (AuthenticationException ae) {
                builder = Response.status(Status.UNAUTHORIZED);
            }
        }
        return builder.build();
    }

}
