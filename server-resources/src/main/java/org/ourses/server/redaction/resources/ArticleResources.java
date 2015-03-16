package org.ourses.server.redaction.resources;

import java.util.Date;
import java.util.List;
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
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.helpers.ProfileHelper;
import org.ourses.server.newsletter.helper.MailHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.helpers.ArticleHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;
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
    private MailHelper mailHelper;

    @POST
    @Path("/check/title")
    public Response checkTitle(final String title, @QueryParam("id")
    final Long id) {
        ResponseBuilder responseBuilder = Response.status(Status.NO_CONTENT);
        if (title.isEmpty() || articleHelper.isTitleAlreadyTaken(title, id)) {
            responseBuilder = Response.status(Status.FORBIDDEN);
        }
        return responseBuilder.build();
    }

    @GET
    @Path("/{id}")
    public Response read(@PathParam("id")
    final long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
        CacheControl noCache = new CacheControl();
        noCache.setNoCache(true);
        noCache.setPrivate(true);
        return responseBuilder.cacheControl(noCache).build();
    }

    @GET
    @Path("/{id}/related")
    public Response readRelated(@PathParam("id")
    final long id) {
        ResponseBuilder responseBuilder;
        List<Article> relatedArticles = articleHelper.findThreeArticlesWithMostTagsInCommon(id);
        List<ArticleDTO> relatedArticlesDTO = Lists.transform(relatedArticles, new Function<Article, ArticleDTO>() {

            @Override
            public ArticleDTO apply(final Article article) {
                return article.toArticleDTO();
            }
        });
        // cache = 1 day
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(86400);
        cacheControl.setPrivate(false);
        responseBuilder = Response.status(Status.OK).cacheControl(cacheControl).entity(relatedArticlesDTO);
        return responseBuilder.build();
    }

    @GET
    @Path("/{rubrique}/{dateLong}/{title}")
    public Response read(@PathParam("rubrique")
    final String rubrique, @PathParam("title")
    final String title, @PathParam("dateLong")
    final long dateLong) {
        ResponseBuilder responseBuilder;
        Article article = articleHelper.findOnlineArticle(rubrique, title, dateLong);
        // détermine si un article est lisible par un utilisateur
        if (article != null && articleHelper.isArticleReadable(null, null, article.getStatus())) {
            responseBuilder = Response.status(Status.OK).entity(article.toArticleDTO());
            // cache = 1 year
            CacheControl cacheControl = new CacheControl();
            cacheControl.setMaxAge(31536000);
            cacheControl.setPrivate(false);
            responseBuilder.cacheControl(cacheControl).tag(article.getPath());
        }
        else {
            CacheControl noCache = new CacheControl();
            noCache.setNoCache(true);
            noCache.setPrivate(false);
            responseBuilder = Response.status(Status.NOT_FOUND);
        }
        return responseBuilder.build();
    }

    @GET
    public Response readAll(@HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token, @QueryParam(value = "criteria")
    final String parameter) {
        ResponseBuilder responseBuilder;
        Set<Article> articles = Sets.newHashSet();
        // push les articles en ligne pour tous les utilisateurs
        articles.addAll(articleHelper.findOnline(parameter));
        // passage en DTO
        Set<ArticleDTO> articlesDto = Sets.newHashSet();
        for (Article article : articles) {
            articlesDto.add(article.toArticleDTO());
        }
        CacheControl noCache = new CacheControl();
        noCache.setNoCache(true);
        noCache.setPrivate(true);
        responseBuilder = Response.status(Status.OK).cacheControl(noCache).entity(articlesDto);
        return responseBuilder.build();
    }

    @GET
    @Path("/draft")
    public Response readAllDraftArticles(@HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
        ResponseBuilder responseBuilder;
        Set<Article> articles = Sets.newHashSet();
        if (token != null) {
            // recherche le profil associé
            Profile profile = profileHelper.findProfileByAuthcToken(token);
            // Je suis connecté
            if (profile != null) {
                articles.addAll(articleHelper.findToCheckAndDraftAndPublished(profile.getId(), token));
            }
        }
        // passage en DTO
        Set<ArticleDTO> articlesDto = Sets.newHashSet();
        for (Article article : articles) {
            articlesDto.add(article.toArticleDTO());
        }
        CacheControl noCache = new CacheControl();
        noCache.setNoCache(true);
        noCache.setPrivate(true);
        responseBuilder = Response.status(Status.OK).cacheControl(noCache).entity(articlesDto);
        return responseBuilder.build();
    }

    @GET
    @Path("/last")
    public Response readLastPublishedArticle() {
        ResponseBuilder responseBuilder;
        List<Article> articles = articleHelper.findLastPublishedArticle();
        // passage en DTO
        List<ArticleDTO> articlesDto = Lists.newArrayList();
        for (Article article : articles) {
            articlesDto.add(article.toArticleDTO());
        }
        CacheControl noCache = new CacheControl();
        noCache.setNoCache(true);
        noCache.setPrivate(false);
        responseBuilder = Response.status(Status.OK).cacheControl(noCache).entity(articlesDto);
        return responseBuilder.build();
    }

    @GET
    @Path("/last/review")
    public Response readLastWebReview() {
        Article lastWebReview = articleHelper.findLastWebReview();
        ResponseBuilder response = null;
        if (lastWebReview != null) {
            response = Response.status(Status.OK).entity(lastWebReview.toArticleDTO());
        }
        else {
            response = Response.status(Status.NOT_FOUND);
        }
        CacheControl noCache = new CacheControl();
        noCache.setNoCache(true);
        noCache.setPrivate(false);
        return response.cacheControl(noCache).build();
    }

    @PUT
    @Path("/create")
    public Response create(final ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
    final long id, final ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
    final long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
    final long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token, final Date publishedDate) {
        // vérification que l'action est fait pas une administratrice et que l'article est bien en à valider
        ResponseBuilder responseBuilder;
        Profile profile = profileHelper.findProfileByAuthcToken(token);
        if (profile != null && articleHelper.isArticleUpdatable(profile.getId(), id, ArticleStatus.AVERIFIER)) {
            // update du status de l'article
            Article article = articleHelper.publishArticle(id, publishedDate);
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
    final long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
    final long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
    final long id, @HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
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
    final long id, final String mail, @HeaderParam(HttpHeaders.HOST)
    final String hostName) {
        ResponseBuilder responseBuilder;
        if (mailHelper.isMailValid(mail)) {
            mailHelper.shareArticle(hostName, mail, id);
            responseBuilder = Response.status(Status.NO_CONTENT);
        }
        else {
            responseBuilder = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return responseBuilder.build();
    }
}
