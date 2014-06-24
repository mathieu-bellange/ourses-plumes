package org.ourses.server.redaction.helpers;

import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;

public interface ArticleHelper {

    boolean isArticleUpdatable(long idProfile, long idArticle, ArticleStatus brouillon);

    void updateFromDTO(Article article, ArticleDTO articleDTO);

}
