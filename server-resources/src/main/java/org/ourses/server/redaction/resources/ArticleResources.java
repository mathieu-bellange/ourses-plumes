package org.ourses.server.redaction.resources;

import javax.ws.rs.Consumes;
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

    @PUT
    @Path("/create")
    public Response createArticle(ArticleDTO articleDTO, @HeaderParam(HttpHeaders.AUTHORIZATION)
    String token) {
        ResponseBuilder responseBuilder = Response.status(Status.CREATED);
        Article article = articleDTO.toArticle();
        // injection du profil qui créé l'article
        article.setProfile(profileHelper.findProfileByAuthcToken(token));
        article.save();
        return responseBuilder.entity(article.toArticleDTO()).build();
    }
}
