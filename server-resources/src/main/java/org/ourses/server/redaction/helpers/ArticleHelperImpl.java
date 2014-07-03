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
    public boolean isArticleUpdatable(Long idProfile, long idArticle, ArticleStatus status) {
        boolean isUpdatable = false;
        switch (status) {
        case BROUILLON:
            isUpdatable = isProfileIsTheOwner(idProfile, idArticle, status);
            break;
        case AVERIFIER:
            isUpdatable = isAdminAndValidateArticle(idProfile, idArticle, status);
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
    public boolean isArticleReadable(Long idProfile, Long idArticle, ArticleStatus status) {
        boolean isReadable = false;
        switch (status) {
        case BROUILLON:
            // seul la rédactrice du brouillon à accès au brouillon
            break;
        case AVERIFIER:
            // seul une administratrice à accès à un A vérifier
            break;
        case ENLIGNE:
            // tout le monde à accès au publish
            isReadable = true;
            break;
        default:
            break;
        }
        return isReadable;
    }

    private boolean isProfileIsTheOwner(Long idProfile, long idArticle, ArticleStatus status) {
        return Article.countArticleByProfileAndStatus(idProfile, idArticle, status) > 0;
    }

    private boolean isAdminAndValidateArticle(Long idProfile, long idArticle, ArticleStatus status) {
        boolean isAdminAndValidateArticle = false;
        if (idProfile != null) {
            BearAccount account = BearAccount.findAdminAccountByProfileId(idProfile);
            if (account != null && RolesUtil.ADMINISTRATRICE.equals(account.getAuthzInfo().getMainRole())) {
                isAdminAndValidateArticle = Article.countArticleByStatus(idArticle, status) > 0;
            }
        }
        return isAdminAndValidateArticle;
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

    @Override
    public Article publishArticle(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.ENLIGNE);
        article.update("status");
        // TODO date de publication ?
        return article;
    }

    @Override
    public Article invalidateArticle(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.BROUILLON);
        article.update("status");
        return article;
    }

}
