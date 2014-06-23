package org.ourses.server.redaction.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.administration.helpers.ProfileHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.common.net.HttpHeaders;
import com.sun.jersey.api.client.ClientResponse.Status;

@Controller
@Path("/articles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArticleResources {

    @Autowired
    private ProfileHelper profileHelper;

    @PUT
    @Path("/draft/create")
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
    @Path("/draft/{id}")
    public Response updateDraft(@RequestParam("id")
    long id, ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // TODO vérification que l'article appartient au profil connecté
        // TODO update de l'article passé en param
        ResponseBuilder responseBuilder = Response.status(Status.OK);
        Article article = articleDTO.toArticle();
        article.save();
        return responseBuilder.entity(article.toArticleDTO()).build();
    }

    @PUT
    @Path("/draft/{id}/validate")
    public Response validateDraft(@RequestParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder = Response.status(Status.OK);
        // TODO vérification que l'article appartient au profil connecté
        // TODO vérification que l'article est bien en brouillon
        // TODO update du status de l'article
        return responseBuilder.build();
    }

    @PUT
    @Path("/validate/{id}")
    public Response updateValidate(@RequestParam("id")
    long id, ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // TODO vérification que l'action est fait pas une administratrice
        // TODO vérification que l'article est bien en à valider
        // TODO update de l'article passé en param
        ResponseBuilder responseBuilder = Response.status(Status.OK);
        return responseBuilder.build();
    }

    @PUT
    @Path("/validate/{id}/publish")
    public Response publishValidate(@RequestParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // TODO vérification que l'action est fait pas une administratrice
        // TODO vérification que l'article est bien en à valider
        // TODO update du status de l'article
        ResponseBuilder responseBuilder = Response.status(Status.OK);
        return responseBuilder.build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteArticle(@RequestParam("id")
    long id, ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // TODO vérification que l'action est fait pas une administratrice pour les articles à valider et par son
        // auteure pour les brouillons
        // TODO suppression de l'article passé en param
        ResponseBuilder responseBuilder = Response.status(Status.OK);
        return responseBuilder.build();
    }

}
