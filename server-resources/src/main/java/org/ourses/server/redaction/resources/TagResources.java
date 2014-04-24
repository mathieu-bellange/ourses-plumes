package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.shiro.authz.annotation.RequiresRoles;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Tag;
import org.ourses.server.redaction.helpers.TagHelper;
import org.ourses.server.security.util.RolesUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Sets;

@Controller
@Path("/tag")
public class TagResources {

    @Autowired
    TagHelper tagHelper;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RequiresRoles({ RolesUtil.REDACTRICE, RolesUtil.ADMINISTRATRICE })
    public Set<TagDTO> findAllTag() {
        Set<Tag> tags = tagHelper.findAllTag();
        Set<TagDTO> tagsToReturn = Sets.newHashSet(Collections2.transform(tags, new Function<Tag, TagDTO>() {

            @Override
            public TagDTO apply(Tag input) {
                return input.toTagDTO();
            }
        }));
        return tagsToReturn;
    }

    protected void setTagHelper(TagHelper tagHelper) {
        this.tagHelper = tagHelper;
    }
}
