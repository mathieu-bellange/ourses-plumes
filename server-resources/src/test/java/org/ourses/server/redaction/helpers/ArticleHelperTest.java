package org.ourses.server.redaction.helpers;

import static org.fest.assertions.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anySetOf;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.HashSet;
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
import org.ourses.server.redaction.domain.entities.Rubrique;
import org.ourses.server.redaction.domain.entities.Tag;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;

import com.google.common.collect.Sets;

@ContextConfiguration("classpath:META-INF/spring/application-context.xml")
public class ArticleHelperTest extends AbstractTransactionalJUnit4SpringContextTests {

    ArticleHelperImpl helper = new ArticleHelperImpl();

    @Test
    public void shouldCopyUpdatableProperty() {
        // seul le title, body, description, publishedDate, tags, category et rubrique sont modifiable par l'utilisateur
        Article article = Mockito.mock(Article.class);
        ArticleDTO articleDTO = new ArticleDTO();
        articleDTO.setTitle("Ceci est un test");
        RubriqueDTO rubriqueDTO = new RubriqueDTO(1l, "rubrique");
        CategoryDTO categoryDTO = new CategoryDTO(1l, "cat");
        TagDTO tagDTO = Mockito.mock(TagDTO.class);
        when(tagDTO.getTag()).thenReturn("Tag");
        Set<TagDTO> tags = Sets.newHashSet();
        tags.add(tagDTO);
        articleDTO.setRubrique(rubriqueDTO);
        articleDTO.setCategory(categoryDTO);
        articleDTO.setTags(tags);
        helper.updateFromDTO(article, articleDTO);
        verify(tagDTO).setTag("tag");
        verify(article, never()).setId(anyLong());
        verify(article, never()).setStatus(any(ArticleStatus.class));
        verify(article, never()).setProfile(any(Profile.class));
        verify(article).setBody(articleDTO.getBody());
        verify(article).setTitle(articleDTO.getTitle());
        verify(article).setTitleBeautify("ceci-est-un-test");
        verify(article).setDescription(articleDTO.getDescription());
        verify(article).setCategory(articleDTO.getCategory().toCategory());
        verify(article).setRubrique(articleDTO.getRubrique().toRubrique());
        verify(article).setTags(anySetOf(Tag.class));
    }

    @Test
    public void shouldBuildArticlePath() {
        String title = "ceci est un titre de test pour la construction d'un path correct";
        assertThat(helper.beautifyTitle(title)).isEqualTo(
                "ceci-est-un-titre-de-test-pour-la-construction-d-un-path-correct");
    }

    @Test
    public void shouldEscapeAllSpecialCarac() {
        String title = "ceci est un titre plus complexe ! & "
                + "pour la construction d'un path correct: il faut virer=$? ? "
                + "et plein de \"trucs\", d'autres choses/ " + "et #;";
        assertThat(helper.beautifyTitle(title)).isEqualTo(
                "ceci-est-un-titre-plus-complexe-pour-la-construction-d-un-path-correct-il-faut-virer-et-"
                        + "plein-de-trucs-d-autres-choses-et");
    }

    @Test
    public void shouldBuildDraftPath() {
        Article article = new Article();
        article.setStatus(ArticleStatus.BROUILLON);
        article.setId(1l);
        assertThat(helper.buildPath(article)).isEqualTo("/articles/1");
    }

    @Test
    public void shouldBuildValdiatePath() {
        Article article = new Article();
        article.setStatus(ArticleStatus.AVERIFIER);
        article.setId(1l);
        assertThat(helper.buildPath(article)).isEqualTo("/articles/1");
    }

    @Test
    public void shouldBuildPublishPath() {
        Article article = new Article();
        article.setStatus(ArticleStatus.ENLIGNE);
        article.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        article.setTitle("le titre");
        assertThat(helper.buildPath(article)).isEqualTo("/articles/rubrique/" + new Date().getTime() + "/le-titre");
    }

    @Test
    public void shouldFilter3ArticleWithMostTags() {
        Article article1 = new Article(1l), article2 = new Article(2l), article3 = new Article(3l), article4 = new Article(
                4l), article5 = new Article(5l), article6 = new Article(6l);
        article1.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        article2.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        article3.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        article4.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        article5.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        article6.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        Tag tag1 = new Tag(1l, "tag1"), tag2 = new Tag(2l, "tag2"), tag3 = new Tag(3l, "tag3"), tag4 = new Tag(4l,
                "tag4"), tag5 = new Tag(5l, "tag5"), tag6 = new Tag(6l, "tag6");
        article1.setTags(Sets.newHashSet(tag1, tag2, tag3));
        article2.setTags(new HashSet<Tag>());
        article3.setTags(Sets.newHashSet(tag1, tag4, tag5));
        article4.setTags(Sets.newHashSet(tag1, tag2, tag3));
        article5.setTags(Sets.newHashSet(tag1, tag5, tag6));
        article6.setTags(Sets.newHashSet(tag1, tag3, tag6, tag4));
        Set<Article> articles = Sets.newHashSet(article2, article3, article4, article5, article6);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articles)).containsSequence(article4,
                article6);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articles)).excludes(article2);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articles)).hasSize(3);
    }

    @Test
    public void shouldFilter2ArticleWithMostTags() {
        Article article1 = new Article(1l), article2 = new Article(2l), article3 = new Article(3l), article4 = new Article(
                4l), article5 = new Article(5l), article6 = new Article(6l);
        article1.setRubrique(new Rubrique(1l, "Rubrique1", "rubrique1"));
        article2.setRubrique(new Rubrique(1l, "Rubrique2", "rubrique2"));
        article3.setRubrique(new Rubrique(1l, "Rubrique3", "rubrique3"));
        article4.setRubrique(new Rubrique(1l, "Rubrique4", "rubrique4"));
        article5.setRubrique(new Rubrique(1l, "Rubrique5", "rubrique5"));
        article6.setRubrique(new Rubrique(1l, "Rubrique6", "rubrique6"));
        Tag tag1 = new Tag(1l, "tag1"), tag2 = new Tag(2l, "tag2"), tag3 = new Tag(3l, "tag3"), tag4 = new Tag(4l,
                "tag4"), tag5 = new Tag(5l, "tag5"), tag6 = new Tag(6l, "tag6");
        article1.setTags(Sets.newHashSet(tag1, tag2, tag3));
        article2.setTags(new HashSet<Tag>());
        article3.setTags(Sets.newHashSet(tag4, tag5));
        article4.setTags(Sets.newHashSet(tag1, tag2, tag3));
        article5.setTags(Sets.newHashSet(tag5, tag6));
        article6.setTags(Sets.newHashSet(tag1, tag3, tag6, tag4));
        Set<Article> articlesWithSameRubrique = Sets.newHashSet(article2, article3, article4, article5, article6);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articlesWithSameRubrique)).containsSequence(
                article4, article6);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articlesWithSameRubrique)).excludes(article2,
                article3, article5);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articlesWithSameRubrique)).hasSize(2);
    }

    @Test
    public void shouldFilterNoArticleWithMostTags() {
        Article article1 = new Article(1l), article2 = new Article(2l), article3 = new Article(3l), article4 = new Article(
                4l), article5 = new Article(5l), article6 = new Article(6l);
        article1.setRubrique(new Rubrique(1l, "Rubrique1", "rubrique1"));
        article2.setRubrique(new Rubrique(1l, "Rubrique2", "rubrique2"));
        article3.setRubrique(new Rubrique(1l, "Rubrique3", "rubrique3"));
        article4.setRubrique(new Rubrique(1l, "Rubrique4", "rubrique4"));
        article5.setRubrique(new Rubrique(1l, "Rubrique5", "rubrique5"));
        article6.setRubrique(new Rubrique(1l, "Rubrique6", "rubrique6"));
        Tag tag1 = new Tag(1l, "tag1"), tag2 = new Tag(2l, "tag2"), tag3 = new Tag(3l, "tag3"), tag4 = new Tag(4l,
                "tag4"), tag5 = new Tag(5l, "tag5"), tag6 = new Tag(6l, "tag6");
        article1.setTags(Sets.newHashSet(tag1, tag2, tag3));
        article2.setTags(new HashSet<Tag>());
        article3.setTags(Sets.newHashSet(tag4, tag5));
        article4.setTags(Sets.newHashSet(tag4, tag5, tag6));
        article5.setTags(Sets.newHashSet(tag5, tag6));
        article6.setTags(Sets.newHashSet(tag4, tag5, tag6));
        Set<Article> articlesWithSameRubrique = Sets.newHashSet(article2, article3, article4, article5, article6);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articlesWithSameRubrique)).excludes(article2,
                article3, article5, article4, article6);
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articlesWithSameRubrique)).hasSize(0);
    }

    @Test
    public void shouldFilterNoArticleWithMostTags2() {
        Article article1 = new Article(1l);
        article1.setRubrique(new Rubrique(1l, "Rubrique", "rubrique"));
        Tag tag1 = new Tag(1l, "tag1"), tag2 = new Tag(2l, "tag2"), tag3 = new Tag(3l, "tag3");
        article1.setTags(Sets.newHashSet(tag1, tag2, tag3));
        Set<Article> articlesWithSameRubrique = Sets.newHashSet();
        assertThat(helper.findThreeArticlesWithMostTagsInCommon(article1, articlesWithSameRubrique)).hasSize(0);
    }

    @Test
    public void shouldProcessParameters() {
        String parameters = "Le petit test de la fonction de recherche";
        assertThat(helper.processParameters(parameters)).containsOnly("petit", "test", "fonction", "recherche");
    }
}
