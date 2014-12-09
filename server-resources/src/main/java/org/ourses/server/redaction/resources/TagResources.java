package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Tag;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Sets;

@Controller
@Path("/tags")
public class TagResources {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response findAllTag(@QueryParam("criteria")
    String criteria) {
        Set<Tag> tags = Tag.findAllTag(criteria.toLowerCase());
        Set<TagDTO> tagsDTO = Sets.newHashSet();
        for (Tag tag : tags) {
            tagsDTO.add(tag.toTagDTO());
        }
        // no cache
        return Response.ok(tagsDTO).build();
    }
}
