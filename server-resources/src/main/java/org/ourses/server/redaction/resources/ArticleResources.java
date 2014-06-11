package org.ourses.server.redaction.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.springframework.stereotype.Controller;

import com.sun.jersey.api.client.ClientResponse.Status;

@Controller
@Path("/articles")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ArticleResources {

    @PUT
    @Path("/create")
    public Response createArticle(ArticleDTO article) {
        ResponseBuilder responseBuilder = Response.status(Status.CREATED);
        return responseBuilder.entity(article).build();
    }
}
