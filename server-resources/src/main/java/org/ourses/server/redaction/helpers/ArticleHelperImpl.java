package org.ourses.server.redaction.helpers;

import java.util.Set;

import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.domain.entities.Tag;
import org.ourses.server.security.util.RolesUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.google.common.collect.Sets;

@Component
public class ArticleHelperImpl implements ArticleHelper {

    @Override
    public boolean isArticleUpdatable(long idProfile, long idArticle, ArticleStatus status) {
        boolean isUpdatable = false;
        switch (status) {
        case BROUILLON:
            isUpdatable = Article.countArticleByProfileAndStatus(idProfile, idArticle, status) > 0;
            break;
        case AVERIFIER:
            BearAccount account = BearAccount.findAdminAccountByProfileId(idProfile);
            if (account != null && RolesUtil.ADMINISTRATRICE.equals(account.getAuthzInfo().getMainRole())) {
                isUpdatable = Article.countArticleByStatus(idArticle, status) > 0;
            }
            break;
        case ENLIGNE:
            isUpdatable = false;
            break;
        default:
            break;
        }
        return isUpdatable;
    }

    @Override
    public void updateFromDTO(Article article, ArticleDTO articleDTO) {
        BeanUtils.copyProperties(articleDTO, article, new String[] { "category", "rubrique", "profile", "id", "status",
                "tags" });
        article.setRubrique(articleDTO.getRubrique().toRubrique());
        article.setCategory(articleDTO.getCategory().toCategory());
        // tags
        Set<Tag> tags = Sets.newHashSet();
        for (TagDTO tag : articleDTO.getTags()) {
            tags.add(tag.toTag());
        }
        article.setTags(tags);
        article.update("category", "rubrique", "title", "body", "description", "publishedDate", "tags");
    }

    @Override
    public Article validateDraft(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.AVERIFIER);
        article.update("status");
        return article;
    }
}
