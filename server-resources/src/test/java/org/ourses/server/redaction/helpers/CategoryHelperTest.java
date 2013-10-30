package org.ourses.server.redaction.helpers;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.domain.entities.redaction.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class CategoryHelperTest {

    @Autowired
    TagHelper tagHelper;

    @Test
    public void shouldRetrieveSetsOfCategory() {
        Set<Tag> tags = tagHelper.findAllTag();
        // ATTENTION données en base
        assertThat(tags).onProperty("tag").containsOnly("Tag 1", "Tag 2");
    }
}
