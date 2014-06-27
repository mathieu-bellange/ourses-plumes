package org.ourses.server.redaction.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.helpers.ProfileHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.helpers.ArticleHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

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

    @PUT
    @Path("/create")
    public Response createArticle(ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder = Response.status(Status.CREATED);
        Article article = articleDTO.toArticle();
        // injection du profil qui créé l'article
        article.setProfile(profileHelper.findProfileByAuthcToken(token));
        // place le status à brouillon
        article.setStatus(ArticleStatus.BROUILLON);
        article.save();
        return responseBuilder.entity(article.toArticleDTO()).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateDraft(@PathParam("id")
    long id, ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder;
        Article article = Article.findArticle(id);
        // vérification que l'article est bien modifiable par l'utilisateur connecté
        Profile profile = profileHelper.findProfileByAuthcToken(token);
        if (profile != null && articleHelper.isArticleUpdatable(profile.getId(), id, article.getStatus())
                && id == articleDTO.getId()) {
            // update de l'article passé en param
            articleHelper.updateFromDTO(article, articleDTO);
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.UNAUTHORIZED);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}/validate")
    public Response validateDraft(@PathParam("id")
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
    public Response publishValidate(@PathParam("id")
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

    @DELETE
    @Path("/{id}")
    public Response deleteArticle(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // TODO vérification que l'action est fait pas une administratrice pour les articles à valider et par son
        // auteure pour les brouillons
        // TODO suppression de l'article passé en param
        ResponseBuilder responseBuilder = Response.status(Status.OK);
        return responseBuilder.build();
    }

}
