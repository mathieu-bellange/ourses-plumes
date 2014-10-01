package org.ourses.server.redaction.resources;

import java.util.Map;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Maps;
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
        if (article != null && articleHelper.isArticleUpdatable(idProfile, id, article.getStatus())) {
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
    String token, @QueryParam(value = "tag")
    String tag, @QueryParam(value = "rubrique")
    String rubrique, @QueryParam(value = "category")
    String category) {
        ResponseBuilder responseBuilder;
        Set<Article> articles = Sets.newHashSet();
        Map<String, String> parameters = Maps.newHashMap();
        parameters.put(Article.CRITERIA_TAG, tag);
        parameters.put(Article.CRITERIA_RUBRIQUE, rubrique);
        parameters.put(Article.CRITERIA_CATEGORY, category);
        if (token != null) {
            // recherche le profil associé
            Profile profile = profileHelper.findProfileByAuthcToken(token);
            // Je suis connecté
            if (profile != null) {
                articles.addAll(articleHelper.findToCheckAndDraft(profile.getId(), token, parameters));
            }
        }
        // push les articles en ligne pour tous les utilisateurs
        articles.addAll(articleHelper.findOnline(parameters));
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
        if (!articleHelper.isTitleAlreadyTaken(articleDTO.getTitle(), articleDTO.getId())) {
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
        // un article brouillon est modifiable uniquement par son auteure
        // un article à vérifier uniquement par une administratrice
        Article article = Article.findArticle(id);
        if (idProfile != null && articleHelper.isArticleUpdatable(idProfile, id, article.getStatus())) {
            // vérifie que l'aticle a bien un titre qui n'existe pas déjà
            if (!articleHelper.isTitleAlreadyTaken(articleDTO.getTitle(), id)) {
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
            responseBuilder = Response.status(Status.NOT_FOUND);
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
            responseBuilder = Response.status(Status.NOT_FOUND);
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
        if (profile != null
                && (articleHelper.isAdminAndGoodStatusArticle(profile.getId(), id, ArticleStatus.AVERIFIER) || articleHelper
                        .isProfileIsTheOwner(profile.getId(), id, ArticleStatus.AVERIFIER))) {
            // update du status de l'article
            Article article = articleHelper.invalidateArticle(id);
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}/recall")
    public Response recall(@PathParam("id")
    long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        // vérification que l'action est fait pas une administratrice et que l'article est bien enligne
        // ou alors fait par une rédactrice sur ses articles uniquement
        ResponseBuilder responseBuilder;
        Profile profile = profileHelper.findProfileByAuthcToken(token);
        if (profile != null
                && (articleHelper.isAdminAndGoodStatusArticle(profile.getId(), id, ArticleStatus.ENLIGNE) || articleHelper
                        .isProfileIsTheOwner(profile.getId(), id, ArticleStatus.ENLIGNE))) {
            // update du status de l'article
            Article article = articleHelper.recallArticle(id);
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
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
            articleHelper.delete(article);
            responseBuilder = Response.status(Status.NO_CONTENT);
        }
        else {
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }

    @PUT
    @Path("/{id}/share")
    public Response sharingByMail(@PathParam("id")
    long id, String mail) {
        ResponseBuilder responseBuilder;
        if (mail != null) {
            responseBuilder = Response.status(Status.NO_CONTENT);
        }
        else {
            responseBuilder = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return responseBuilder.build();
    }
}
