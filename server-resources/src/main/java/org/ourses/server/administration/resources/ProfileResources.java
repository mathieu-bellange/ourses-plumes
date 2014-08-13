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
import org.ourses.server.administration.helpers.BearAccountHelper;
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
    BearAccountHelper accountHelper;
    @Autowired
    private ProfileHelper profileHelper;

    @GET
    @Path("/{pseudo}/authz")
    public Response getProfileRole(@PathParam("pseudo")
    String pseudoBeautify) {
        String role = profileHelper.findProfileRole(pseudoBeautify);
        ResponseBuilder builder;
        if (role == null) {
            builder = Response.status(Status.NOT_FOUND);
        }
        else {
            builder = Response.ok().entity(role);
        }
        return builder.build();
    }

    @GET
    @Path("/{id}")
    public Response getProfile(@PathParam("id")
    String id) {

        Profile profile = profileHelper.findPublicProfile(id);
        ResponseBuilder builder;
        if (profile == null) {
            builder = Response.status(Status.NOT_FOUND);
        }
        else {
            builder = Response.ok().entity(profile.toProfileDTO());
        }
        return builder.build();
    }

    @GET
    @Path("/avatar/{id}")
    @Produces("image/png")
    public Response getProfileAvatar(@PathParam("id")
    Long id) {

        byte[] avatar = null;
        try {
            avatar = profileHelper.findAvatar(id);
        }
        catch (Exception e) {

        }
        ResponseBuilder builder;
        if (avatar == null) {
            builder = Response.status(Status.NOT_FOUND);
        }
        else {
            builder = Response.ok().entity(avatar);
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
                // vérificatin que le pseudo n'est pas déjà pris ou vide
                if (Profile.PSEUDO.equals(coupleDTO.getProperty())
                        && (!accountHelper.isNewPseudo(coupleDTO.getValue(), id) || !accountHelper
                                .isPseudoValid(coupleDTO.getValue()))) {
                    builder = Response.status(Status.FORBIDDEN);
                }
                else {
                    Profile profile = Profile.findProfileWithSocialLinks(id);
                    if (profileHelper.updateProfileProperty(profile, coupleDTO)) {
                        // maj des liens sociaux
                        if (SocialLinkUtil.NETWORK.contains(coupleDTO.getProperty())) {
                            profile.updateProfileProperty("socialLink");
                        }
                        // maj d'une propriété du profil
                        else if (coupleDTO.getProperty().equals(Profile.PSEUDO)) {
                            profile.updateProfileProperty(coupleDTO.getProperty(), Profile.PATH,
                                    Profile.PSEUDO_BEAUTIFY);
                        }
                        else {
                            profile.updateProfileProperty(coupleDTO.getProperty());
                        }
                    }
                    builder = Response.status(Status.NO_CONTENT);
                }
            }
            catch (AuthenticationException ae) {
                builder = Response.status(Status.UNAUTHORIZED);
            }
        }
        return builder.build();
    }
}
