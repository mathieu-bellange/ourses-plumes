package org.ourses.server.redaction.helpers;

import java.util.Date;
import java.util.Set;

import org.apache.commons.lang3.text.StrBuilder;
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

    // tout sauf le & traité comme un et
    private static final String URI_RESERVED_CHARAC_TO_ESCAPE = ";/?:@=+$,";
    private static final String AND_CHARAC = "&";
    // carac non réservé (sauf le ' remplacé par un -) mais a un sens pour le navigo, échappé aussi
    private static final String OTHER_CHARAC_TO_ESCAPE = "\".!~*()";
    private static final String OTHER_CHARAC_TO_REPLACE = "'";
    private static final String URL_SEPARATOR = "-";

    @Override
    public boolean isArticleUpdatable(Long idProfile, long idArticle, ArticleStatus status) {
        boolean isUpdatable = false;
        switch (status) {
        case BROUILLON:
            // seul la rédactrice peut modifier un brouillon
            isUpdatable = isProfileIsTheOwner(idProfile, idArticle, status);
            break;
        case AVERIFIER:
            // seul une administratrice peut modifier un A vérifier
            isUpdatable = isAdminAndValidateArticle(idProfile, idArticle, status);
            break;
        case ENLIGNE:
            // un article en ligne ne peut être modifié
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
            isReadable = isProfileIsTheOwner(idProfile, idArticle, status);
            break;
        case AVERIFIER:
            // seul une administratrice à accès à un A vérifier
            isReadable = isAdminAndValidateArticle(idProfile, idArticle, status);
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
        boolean isProfileIsTheOwner = false;
        if (idProfile != null) {
            isProfileIsTheOwner = Article.countArticleByProfileAndStatus(idProfile, idArticle, status) > 0;
        }
        return isProfileIsTheOwner;
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
    public void createDraft(Article article) {
        // place le status à brouillon
        article.setStatus(ArticleStatus.BROUILLON);
        article.setTitleBeautify(beautifyTitle(article.getTitle()));
        article.setCreatedDate(new Date());
        article.save();
        // créer le path
        article.setPath(buildPath(article));
        article.update("path");
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
        article.setTitleBeautify(beautifyTitle(articleDTO.getTitle()));
        article.setUpdatedDate(new Date());
        article.update("category", "rubrique", "title", "body", "description", "tags", "titleBeautify", "updatedDate");
    }

    @Override
    public Article validateDraft(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.AVERIFIER);
        article.setUpdatedDate(new Date());
        article.update("status", "updatedDate");
        return article;
    }

    @Override
    public Article publishArticle(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.ENLIGNE);
        article.setPath(buildPath(article));
        article.setTitleBeautify(beautifyTitle(article.getTitle()));
        article.update("status", "path", "titleBeautify");
        // TODO published date
        return article;
    }

    @Override
    public Article invalidateArticle(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.BROUILLON);
        article.setUpdatedDate(new Date());
        article.update("status", "updatedDate");
        return article;
    }

    /**
     * Construit un titre allégé de tous ses caractères spéciaux
     * 
     * @param title
     * @return
     */
    protected String beautifyTitle(String title) {
        StrBuilder path = new StrBuilder();
        String[] tokens = title.split("\\W");
        for (String token : tokens) {
            if (!token.isEmpty()) {
                path.appendSeparator(URL_SEPARATOR);
                path.append(token.toLowerCase());
            }
        }
        return path.toString();

    }

    @Override
    public String buildPath(Article article) {
        StringBuilder pathBuilder = new StringBuilder("/articles");
        switch (article.getStatus()) {
        // path /articles/{id}
        case AVERIFIER:
            pathBuilder.append("/" + article.getId());
            break;
        // path /articles/{id}
        case BROUILLON:
            pathBuilder.append("/" + article.getId());
            break;
        // path /articles/{rubrique}/{titre modifié}
        case ENLIGNE:
            pathBuilder.append("/" + article.getRubrique().getPath());
            pathBuilder.append("/" + beautifyTitle(article.getTitle()));
            break;
        default:
            break;
        }
        return pathBuilder.toString();
    }

    @Override
    public boolean isTitleAlreadyTaken(String title, Long id) {
        return Article.articleWithSameTitleBeautify(beautifyTitle(title), id) > 0;
    }

}
