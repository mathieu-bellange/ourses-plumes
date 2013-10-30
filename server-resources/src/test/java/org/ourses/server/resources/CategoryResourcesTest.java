package org.ourses.server.resources;

import java.util.Set;

import org.fest.assertions.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.ourses.server.domain.entities.redaction.Category;
import org.ourses.server.redaction.helpers.CategoryHelper;

import com.google.common.collect.Sets;

public class CategoryResourcesTest {

    CategoryResources categoryResources = new CategoryResources();
    @Mock
    CategoryHelper categoryHelper;

    public CategoryResourcesTest() {
        MockitoAnnotations.initMocks(this);
    }

    @Before
    public void setUp() {
        categoryResources.setCategoryHelper(categoryHelper);
    }

    @Test
    public void shouldConvertAllCategoryDTO() {
        // prepare
        Set<Category> categories = Sets.newHashSet(new Category(1L, "cat 1"), new Category(2L, "cat 2"));
        Mockito.when(categoryHelper.findAllCategory()).thenReturn(categories);
        //verify
        Assertions.assertThat(categoryResources.findAllCategory()).onProperty("category").containsOnly("cat 1", "cat 2");
    }
}
