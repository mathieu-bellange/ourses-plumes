package org.ourses.server.domain.entities.redaction;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.domain.jsondto.redaction.CategoryDTO;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class CategoryTest {

    @Test
    public void shouldCategoryDTO() {
        Category category = new Category(1l, "category");
        CategoryDTO categoryToVerify = category.toCategoryDTO();
        // un tag ne peut être en double en basse
        assertThat(categoryToVerify.getCategory()).isEqualTo(category.getCategory());
    }

    @Test
    public void shouldRetrieveSetsOfCategory() {
        Set<Category> categories = Category.findAllCategory();
        // ATTENTION données en base
        assertThat(categories).onProperty("category").containsOnly("Catégorie 1", "Catégorie 2");
    }
}
