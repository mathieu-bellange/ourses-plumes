package org.ourses.server.administration.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.security.helpers.SecurityHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/profile")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ProfileResources {

    @Autowired
    private SecurityHelper securityHelper;

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

}
