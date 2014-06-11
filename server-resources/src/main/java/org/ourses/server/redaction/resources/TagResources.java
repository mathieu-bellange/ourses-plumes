package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Tag;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Sets;

@Controller
@Path("/tags")
public class TagResources {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Set<TagDTO> findAllTag() {
        Set<Tag> tags = Tag.findAllTag();
        Set<TagDTO> tagsDTO = Sets.newHashSet();
        for (Tag tag : tags) {
            tagsDTO.add(tag.toTagDTO());
        }
        return tagsDTO;
    }
}
