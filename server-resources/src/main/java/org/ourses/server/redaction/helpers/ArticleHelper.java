package org.ourses.server.redaction.helpers;

import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;

public interface ArticleHelper {

    boolean isArticleUpdatable(Long idProfile, long idArticle, ArticleStatus brouillon);

    void updateFromDTO(Article article, ArticleDTO articleDTO);

    Article validateDraft(long id);

    Article publishArticle(long id);

    Article invalidateArticle(long id);

    Article recallArticle(long id);

    boolean isArticleReadable(Long idProfile, Long id, ArticleStatus status);

    String buildPath(Article article);

    void createDraft(Article article);

    boolean isTitleAlreadyTaken(String title, Long id);

    boolean isAdminAndGoodStatusArticle(Long idProfile, long idArticle, ArticleStatus status);

    boolean isProfileIsTheOwner(Long idProfile, long idArticle, ArticleStatus status);

    void delete(Article article);

}
