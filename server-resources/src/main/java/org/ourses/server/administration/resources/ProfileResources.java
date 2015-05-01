package org.ourses.server.administration.resources;

import java.util.Collection;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.authc.AuthenticationException;
import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.helpers.BearAccountHelper;
import org.ourses.server.administration.helpers.ProfileHelper;
import org.ourses.server.administration.util.SocialLinkUtil;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.helpers.ArticleHelper;
import org.ourses.server.security.helpers.SecurityHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Sets;
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
    @Autowired
    private ArticleHelper articleHelper;

    @GET
    @Path("/writer")
    public Response getWriterProfiles() {
        Set<Profile> profiles = profileHelper.findWriterProfiles();

        Set<ProfileDTO> profilesDTO = Sets.newHashSet();
        for (Profile profile : profiles) {
            profilesDTO.add(profile.toProfileDTO());
        }
        // cache = 1 day
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(86400);
        cacheControl.setPrivate(false);
        return Response.ok().cacheControl(cacheControl).entity(profilesDTO).build();
    }

    @GET
    @Path("/{pseudo}/authz")
    public Response getProfileRole(@PathParam("pseudo")
    final String pseudoBeautify) {
        String role = profileHelper.findProfileRole(pseudoBeautify);
        ResponseBuilder builder;
        if (role == null) {
            builder = Response.status(Status.NOT_FOUND);
        }
        else {
            builder = Response.ok().entity(role);
        }
        // cache = 1 day
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(86400);
        cacheControl.setPrivate(false);
        return builder.cacheControl(cacheControl).build();
    }

    @GET
    @Path("/{id}")
    public Response getProfile(@PathParam("id")
    final String id) {

        Profile profile = profileHelper.findPublicProfile(id);
        ResponseBuilder builder;
        if (profile == null) {
            builder = Response.status(Status.NOT_FOUND);
        }
        else {
            builder = Response.ok().entity(profile.toProfileDTO());
        }
        CacheControl noCache = new CacheControl();
        noCache.setNoCache(true);
        noCache.setPrivate(true);
        noCache.setNoStore(true);
        noCache.setMaxAge(-1);
        return builder.cacheControl(noCache).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateProfile(@PathParam("id")
    final Long id, final CoupleDTO coupleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {

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
                    Profile profile = Profile.findPublicProfile(id);
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

    @DELETE
    @Path("/{id}/avatar")
    public Response deleteAvatar(@PathParam("id")
    final Long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
        // vérification que le compte a récupéré est bien réalisé par l'utilisateur authentifié
        BearAccount bearAccount = BearAccount.findAdminAccountByProfileId(id);
        ResponseBuilder builder;
        try {
            securityHelper.checkAuthenticatedUser(bearAccount.getAuthcInfo().getMail(), token);
            Profile profile = profileHelper.deleteAvatar(id);
            builder = Response.ok().entity(profile.toProfileDTO());
        }
        catch (AuthenticationException ae) {
            builder = Response.status(Status.UNAUTHORIZED);
        }
        return builder.build();
    }

    @GET
    @Path("/{id}/articles")
    public Response userArticles(@PathParam("id")
    final Long id) {
        Collection<? extends Article> articles = articleHelper.findProfileArticles(id);
        // passage en DTO
        Set<ArticleDTO> articlesDto = Sets.newHashSet();
        for (Article article : articles) {
            articlesDto.add(article.toPartialArticleDTO());
        }
        // cache = 1 day
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(86400);
        cacheControl.setPrivate(false);
        return Response.ok().entity(articlesDto).cacheControl(cacheControl).build();
    }
}
