package org.ourses.server.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.shiro.authz.annotation.RequiresRoles;
import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.entities.redaction.Category;
import org.ourses.server.domain.jsondto.redaction.CategoryDTO;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Sets;

@Controller
@Path("/category")
public class CategoryResources {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RequiresRoles({ RolesUtil.REDACTRICE, RolesUtil.ADMINISTRATRICE })
    public Set<CategoryDTO> findAllCategory() {
        Set<Category> categories = Category.findAllCategory();
        Set<CategoryDTO> categoriesToReturn = Sets.newHashSet(Collections2.transform(categories,
                new Function<Category, CategoryDTO>() {

                    @Override
                    public CategoryDTO apply(Category input) {
                        return input.toCategoryDTO();
                    }
                }).iterator());
        return categoriesToReturn;
    }
}
