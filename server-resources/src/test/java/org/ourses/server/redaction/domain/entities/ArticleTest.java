package org.ourses.server.redaction.domain.entities;

import static org.fest.assertions.Assertions.assertThat;

import org.joda.time.DateTime;
import org.junit.Test;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.redaction.domain.dto.ArticleDTO;

import com.google.common.collect.Sets;

public class ArticleTest {

    @Test
    public void shouldConvertIntoDTO() {
        Article article = new Article();
        article.setBody("body");
        article.setTitle("title");
        article.setDescription("description");
        article.setProfile(new Profile(1l, "pseudo", "description"));
        article.setPublishedDate(DateTime.now().toDate());
        article.setRubrique(new Rubrique(1l, "rubrique", "rubrique"));
        article.setStatus(ArticleStatus.BROUILLON);
        article.setCategory(new Category(1l, "category"));
        article.setTags(Sets.newHashSet(new Tag(1l, "tag1"), new Tag(2l, "tag2")));
        ArticleDTO dto = article.toArticleDTO();
        assertThat(dto.getId()).isEqualTo(article.getId());
        assertThat(dto.getBody()).isEqualTo(article.getBody());
        assertThat(dto.getTitle()).isEqualTo(article.getTitle());
        assertThat(dto.getDescription()).isEqualTo(article.getDescription());
        assertThat(dto.getPublishedDate()).isEqualTo(article.getPublishedDate());
        assertThat(dto.getProfile().getPseudo()).isEqualTo(article.getProfile().getPseudo());
        assertThat(dto.getCategory().getCategory()).isEqualTo(article.getCategory().getCategory());
        assertThat(dto.getRubrique().getRubrique()).isEqualTo(article.getRubrique().getRubrique());
        assertThat(dto.getTags()).onProperty("tag").containsOnly("tag1", "tag2");
    }
}
