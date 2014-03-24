package org.ourses.server.redaction.helpers;

import static org.fest.assertions.Assertions.assertThat;

import java.util.Set;

import org.junit.Test;
import org.ourses.server.domain.entities.redaction.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;

@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class TagHelperTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Autowired
    TagHelper tagHelper;

    @Test
    public void shouldRetrieveSetsOfCategory() {
        Set<Tag> tags = tagHelper.findAllTag();
        // ATTENTION données en base
        assertThat(tags).onProperty("tag").containsOnly("Tag 1", "Tag 2");
    }
}
