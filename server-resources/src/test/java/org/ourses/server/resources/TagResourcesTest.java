package org.ourses.server.resources;

import java.util.Set;

import org.fest.assertions.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.ourses.server.domain.entities.redaction.Tag;
import org.ourses.server.redaction.helpers.TagHelper;
import org.ourses.server.resources.TagResources;

import com.google.common.collect.Sets;

public class TagResourcesTest {

    TagResources tagResources = new TagResources();
    @Mock
    TagHelper tagHelper;

    public TagResourcesTest() {
        MockitoAnnotations.initMocks(this);
    }

    @Before
    public void setUp() {
        tagResources.setTagHelper(tagHelper);
    }

    @Test
    public void shouldConvertAllTagDTO() {
        // prepare
        Set<Tag> categories = Sets.newHashSet(new Tag(1L, "tag 1"), new Tag(2L, "tag 2"));
        Mockito.when(tagHelper.findAllTag()).thenReturn(categories);
        // verify
        Assertions.assertThat(tagResources.findAllTag()).onProperty("tag").containsOnly("tag 1", "tag 2");
    }
}
