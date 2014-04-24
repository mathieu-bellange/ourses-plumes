package org.ourses.server.redaction.domain.entities;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Tag;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class TagTest {

    @Test
    public void shouldTagDTO() {
        Tag tag = new Tag(1l, "tag");
        TagDTO tagToVerify = tag.toTagDTO();
        // un tag ne peut être en double en basse
        assertThat(tagToVerify.getTag()).isEqualTo(tag.getTag());
    }
}
