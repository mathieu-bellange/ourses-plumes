package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.entities.Category;
import org.springframework.stereotype.Controller;

import com.google.common.collect.Sets;

@Controller
@Path("/categories")
public class CategoryResources {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Set<CategoryDTO> findAllCategory() {
        Set<Category> categories = Category.findAllCategory();
        Set<CategoryDTO> categoriesDTO = Sets.newHashSet();
        for (Category category : categories) {
            categoriesDTO.add(category.toCategoryDTO());
        }
        return categoriesDTO;
    }
}
