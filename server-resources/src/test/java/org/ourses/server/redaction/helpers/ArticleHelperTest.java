package org.ourses.server.redaction.helpers;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anySetOf;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.Set;

import org.junit.Test;
import org.mockito.Mockito;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.domain.entities.Tag;

import com.google.common.collect.Sets;

public class ArticleHelperTest {

    ArticleHelper helper = new ArticleHelperImpl();

    @Test
    public void shouldCopyUpdatableProperty() {
        // seul le title, body, description, publishedDate, tags, category et rubrique sont modifiable par l'utilisateur
        Article article = Mockito.mock(Article.class);
        ArticleDTO articleDTO = new ArticleDTO();
        RubriqueDTO rubriqueDTO = new RubriqueDTO(1l, "rubrique");
        CategoryDTO categoryDTO = new CategoryDTO(1l, "cat");
        TagDTO tagDTO = Mockito.mock(TagDTO.class);
        Set<TagDTO> tags = Sets.newHashSet();
        tags.add(tagDTO);
        articleDTO.setRubrique(rubriqueDTO);
        articleDTO.setCategory(categoryDTO);
        articleDTO.setTags(tags);
        helper.updateFromDTO(article, articleDTO);
        verify(article, never()).setId(anyLong());
        verify(article, never()).setStatus(any(ArticleStatus.class));
        verify(article, never()).setProfile(any(Profile.class));
        verify(article).setBody(articleDTO.getBody());
        verify(article).setTitle(articleDTO.getTitle());
        verify(article).setDescription(articleDTO.getDescription());
        verify(article).setCategory(articleDTO.getCategory().toCategory());
        verify(article).setRubrique(articleDTO.getRubrique().toRubrique());
        verify(tagDTO).toTag();
        verify(article).setTags(anySetOf(Tag.class));
    }
}
