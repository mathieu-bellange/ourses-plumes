package org.ourses.server.picture.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.picture.helpers.AvatarHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/avatars")
public class AvatarResources {

    @Autowired
    private AvatarHelper avatarHelper;

    @GET
    @Path("/{id}")
    @Produces("image/png")
    public Response getProfileAvatar(@PathParam("id")
    Long id) {

        byte[] avatar = null;
        try {
            avatar = avatarHelper.findAvatar(id);
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
}
