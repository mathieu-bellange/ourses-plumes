package org.ourses.server.redaction.helpers;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;

public interface ArticleHelper {

    boolean isArticleUpdatable(Long idProfile, long idArticle, ArticleStatus brouillon);

    void updateFromDTO(Article article, ArticleDTO articleDTO);

    Article validateDraft(long id);

    Article publishArticle(long id, Date publishedDate);

    Article invalidateArticle(long id);

    Article recallArticle(long id);

    boolean isArticleReadable(Long idProfile, Long id, ArticleStatus status);

    String buildPath(Article article);

    void createDraft(Article article);

    boolean isTitleAlreadyTaken(String title, Long id);

    boolean isAdminAndGoodStatusArticle(Long idProfile, long idArticle, ArticleStatus status);

    boolean isProfileIsTheOwner(Long idProfile, long idArticle, ArticleStatus status);

    void delete(Article article);

    Collection<? extends Article> findOnline(String parameter, int page);

    Collection<? extends Article> findToCheckAndDraftAndPublished(Long profileId, String token, int page);

    Collection<? extends Article> findProfileArticles(Long profileId);

    List<Article> findThreeArticlesWithMostTagsInCommon(long idArticle);

    List<Article> findLastPublishedArticle();

    Article findLastWebReview();

    Article findOnlineArticle(String rubrique, String title, long dateLong);
    
	Collection<ArticleDTO> transformIntoPartial(
			Collection<? extends Article> articles);

	Collection<ArticleDTO> transformIntoFull(
			Collection<? extends Article> articles);
}
