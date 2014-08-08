package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.helpers.ProfileHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.helpers.ArticleHelper;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.helpers.SecurityHelper;
import org.ourses.server.security.util.RolesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Sets;
import com.google.common.net.HttpHeaders;
import com.sun.jersey.api.client.ClientResponse.Status;

@Controller
@Path("/articles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArticleResources {

    @Autowired
    private ProfileHelper profileHelper;
    @Autowired
    private ArticleHelper articleHelper;
    @Autowired
    private SecurityHelper securityHelper;

    @POST
    @Path("/check/title")
    public Response checkTitle(String title, @QueryParam("id")
    Long id) {
        ResponseBuilder responseBuilder = Response.status(Status.NO_CONTENT);
        if (title.isEmpty() || articleHelper.isTitleAlreadyTaken(title, id)) {
            responseBuilder = Response.status(Status.FORBIDDEN);
        }
        return responseBuilder.build();
    }

    @GET
    @Path("/{id}")
    public Response read(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder;
        Article article = Article.findArticle(id);
        Long idProfile = profileHelper.findIdProfile(token);
        // détermine si un article est lisible par un utilisateur
        if (article != null && articleHelper.isArticleReadable(idProfile, id, article.getStatus())) {
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }

    @GET
    @Path("/{rubrique}/{title}")
    public Response read(@PathParam("rubrique")
    String rubrique, @PathParam("title")
    String title) {
        ResponseBuilder responseBuilder;
        Article article = Article.findArticleByRubriqueAndBeautifyTitle(rubrique, title);
        // détermine si un article est lisible par un utilisateur
        if (article != null && articleHelper.isArticleReadable(null, null, article.getStatus())) {
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }

    @GET
    public Response readAll(@HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder;
        Set<Article> articles = Sets.newHashSet();
        if (token != null) {
            // recherche le profil associé
            Profile profile = profileHelper.findProfileByAuthcToken(token);
            // Je suis connecté
            if (profile != null) {
                OurseSecurityToken ourseSecurityToken = securityHelper.findByToken(token);
                // Je suis admin
                if (securityHelper.hasRoles(ourseSecurityToken, Sets.newHashSet(RolesUtil.ADMINISTRATRICE))) {
                    articles.addAll(Article.findToCheckAndDraft());
                }
                // je suis redac, j'ai accès à mes brouillons
                else if (securityHelper.hasRoles(ourseSecurityToken, Sets.newHashSet(RolesUtil.REDACTRICE))) {
                    articles.addAll(Article.findDrafts(profile.getId()));
                }
            }
        }
        // push les articles en ligne pour tous les utilisateurs
        articles.addAll(Article.findOnline());
        // passage en DTO
        Set<ArticleDTO> articlesDto = Sets.newHashSet();
        for (Article article : articles) {
            articlesDto.add(article.toArticleDTO());
        }
        responseBuilder = Response.status(Status.OK).entity(articlesDto);
        return responseBuilder.build();
    }

    @PUT
    @Path("/create")
    public Response create(ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder = Response.status(Status.CREATED);
        Article article = articleDTO.toArticle();
        // vérifie que l'aticle a bien un titre qui n'existe pas déjà
        if (!articleHelper.isTitleAlreadyTaken(article.getTitle(), article.getId())) {
            // injection du profil qui créé l'article
            article.setProfile(profileHelper.findProfileByAuthcToken(token));
            // créer le brouillon
            articleHelper.createDraft(article);
            responseBuilder.entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.FORBIDDEN);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id")
    long id, ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder;
        // vérification que l'article est bien modifiable par l'utilisateur connecté
        Long idProfile = profileHelper.findIdProfile(token);
        // seul un article brouillon est modifiable
        if (idProfile != null && articleHelper.isArticleUpdatable(idProfile, id, ArticleStatus.BROUILLON)) {
            // vérifie que l'aticle a bien un titre qui n'existe pas déjà
            if (!articleHelper.isTitleAlreadyTaken(articleDTO.getTitle(), id)) {
                Article article = Article.findArticle(id);
                // update de l'article passé en param
                articleHelper.updateFromDTO(article, articleDTO);
                responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
            }
            else {
                responseBuilder = Response.status(Status.FORBIDDEN);
            }
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}/validate")
    public Response validate(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder;
        // vérification que l'article appartient au profil connecté
        Profile profile = profileHelper.findProfileByAuthcToken(token);
        if (profile != null && articleHelper.isArticleUpdatable(profile.getId(), id, ArticleStatus.BROUILLON)) {
            // update du status de l'article
            Article article = articleHelper.validateDraft(id);
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.UNAUTHORIZED);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}/publish")
    public Response publish(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // vérification que l'action est fait pas une administratrice et que l'article est bien en à valider
        ResponseBuilder responseBuilder;
        Profile profile = profileHelper.findProfileByAuthcToken(token);
        if (profile != null && articleHelper.isArticleUpdatable(profile.getId(), id, ArticleStatus.AVERIFIER)) {
            // update du status de l'article
            Article article = articleHelper.publishArticle(id);
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.UNAUTHORIZED);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}/invalidate")
    public Response invalidate(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // vérification que l'action est fait pas une administratrice et que l'article est bien en à valider
        ResponseBuilder responseBuilder;
        Profile profile = profileHelper.findProfileByAuthcToken(token);
        if (profile != null && articleHelper.isArticleUpdatable(profile.getId(), id, ArticleStatus.AVERIFIER)) {
            // update du status de l'article
            Article article = articleHelper.invalidateArticle(id);
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.UNAUTHORIZED);
        }
        return responseBuilder.build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder;
        Article article = Article.findArticle(id);
        if (article != null && ArticleStatus.BROUILLON.equals(article.getStatus())) {
            article.delete();
            responseBuilder = Response.status(Status.NO_CONTENT);
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }
}
