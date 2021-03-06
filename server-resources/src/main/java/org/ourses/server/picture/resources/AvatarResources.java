package org.ourses.server.picture.resources;

import java.io.File;
import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.picture.domain.entities.Avatar;
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
    @Produces("image/jpeg")
    public Response getAvatar(@PathParam("id")
    final Long id) {

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
        // cache = 1 year
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(31536000);
        cacheControl.setPrivate(false);
        return builder.cacheControl(cacheControl).build();
    }

    @POST
    @Path("/create")
    @Consumes("image/*")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createAvatar(final File img) {
        ResponseBuilder builder;
        if (avatarHelper.isOk(img)) {
            Avatar avatar;
            try {
                avatar = avatarHelper.save(img);
                builder = Response.ok(avatar.toAvatarDTO());
            }
            catch (IOException e) {
                builder = Response.status(Status.INTERNAL_SERVER_ERROR);
            }
        }
        else {
            builder = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return builder.build();
    }
}
