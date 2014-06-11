package org.ourses.server.redaction.domain.entities;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class CategoryTest {

    @Test
    public void shouldCategoryDTO() {
        Category category = new Category(1l, "category");
        CategoryDTO categoryToVerify = category.toCategoryDTO();
        assertThat(categoryToVerify.getCategory()).isEqualTo(category.getCategory());
    }
}
