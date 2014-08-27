package org.ourses.server.redaction.domain.dto;

import static org.fest.assertions.Assertions.assertThat;

import org.joda.time.DateTime;
import org.junit.Test;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;

import com.google.common.collect.Sets;

public class ArticleDTOTest {

    @Test
    public void shouldConvertIntoEntity() {
        ArticleDTO dto = new ArticleDTO();
        dto.setBody("body");
        dto.setTitle("title");
        dto.setDescription("description");
        dto.setPublishedDate(DateTime.now().toDate());
        dto.setRubrique(new RubriqueDTO(1l, "rubrique"));
        dto.setStatus(ArticleStatus.BROUILLON);
        dto.setCategory(new CategoryDTO(1l, "category"));
        // ne tient pas compte tag1 , il sera chargé en base
        dto.setTags(Sets.newHashSet(new TagDTO(1l, "tag1"), new TagDTO(null, "tag2")));
        Article article = dto.toArticle();
        assertThat(article.getId()).isEqualTo(dto.getId());
        assertThat(article.getBody()).isEqualTo(dto.getBody());
        assertThat(article.getTitle()).isEqualTo(dto.getTitle());
        assertThat(article.getDescription()).isEqualTo(dto.getDescription());
        assertThat(article.getPublishedDate()).isEqualTo(dto.getPublishedDate());
        assertThat(article.getProfile()).isNull();
        assertThat(article.getCategory().getCategory()).isEqualTo(dto.getCategory().getCategory());
        assertThat(article.getRubrique().getRubrique()).isEqualTo(dto.getRubrique().getRubrique());
        assertThat(article.getTags()).onProperty("tag").containsOnly("Tag 1", "tag2");
    }
}
