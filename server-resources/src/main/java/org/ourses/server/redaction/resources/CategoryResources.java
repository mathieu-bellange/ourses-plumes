package org.ourses.server.redaction.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.entities.Category;
import org.ourses.server.redaction.helpers.CategoryHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Sets;

@Controller
@Path("/category")
public class CategoryResources {

    @Autowired
    CategoryHelper categoryHelper;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Set<CategoryDTO> findAllCategory() {
        Set<Category> categories = categoryHelper.findAllCategory();
        Set<CategoryDTO> categoriesToReturn = Sets.newHashSet(Collections2.transform(categories,
                new Function<Category, CategoryDTO>() {

                    @Override
                    public CategoryDTO apply(Category input) {
                        return input.toCategoryDTO();
                    }
                }).iterator());
        return categoriesToReturn;
    }

    @VisibleForTesting
    protected void setCategoryHelper(CategoryHelper categoryHelper) {
        this.categoryHelper = categoryHelper;
    }
}
