package org.ourses.server.redaction.helpers;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.text.StrBuilder;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.domain.entities.Tag;
import org.ourses.server.redaction.domain.utils.RelatedArticle;
import org.ourses.server.security.domain.entities.OurseSecurityToken;
import org.ourses.server.security.helpers.SecurityHelper;
import org.ourses.server.security.util.RolesUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
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
    
    Logger logger = LoggerFactory.getLogger(ArticleHelperImpl.class);

    @Autowired
    private SecurityHelper securityHelper;

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
            isUpdatable = isAdminAndGoodStatusArticle(idProfile, idArticle, status);
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
            isReadable = isAdminAndGoodStatusArticle(idProfile, idArticle, status);
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

    @Override
    public boolean isProfileIsTheOwner(Long idProfile, long idArticle, ArticleStatus status) {
        boolean isProfileIsTheOwner = false;
        if (idProfile != null) {
            isProfileIsTheOwner = Article.countArticleByProfileAndStatus(idProfile, idArticle, status) > 0;
        }
        return isProfileIsTheOwner;
    }

    @Override
    public boolean isAdminAndGoodStatusArticle(Long idProfile, long idArticle, ArticleStatus status) {
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
            tag.setTag(tag.getTag().toLowerCase());
            if (tag.getId() != null) {
                tags.add(Tag.find(tag.getId()));
            }
            else {
                Tag tagBdd = Tag.find(tag.getTag());
                if (tagBdd != null) {
                    tags.add(tagBdd);
                }
                else {
                    tags.add(tag.toTag());
                }
            }
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
        article.setUpdatedDate(new Date());
        article.setPublishedDate(new Date());
        article.update("status", "path", "updatedDate", "publishedDate");
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

    @Override
    public Article recallArticle(long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.AVERIFIER);
        article.setPath(buildPath(article));
        article.setUpdatedDate(new Date());
        article.setPublishedDate(null);
        article.update("status", "path", "updatedDate", "publishedDate");
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
    public void delete(Article article) {
        // TODO suppression des tags inutiles ?
        article.delete();
    }

    @Override
    public boolean isTitleAlreadyTaken(String title, Long id) {
        return Article.articleWithSameTitleBeautify(beautifyTitle(title), id) > 0;
    }

    @Override
    public Collection<? extends Article> findOnline(Map<String, String> parameters) {
        return Article.findOnline(parameters);
    }

    @Override
    public Collection<? extends Article> findToCheckAndDraft(Long profileId, String token,
            Map<String, String> parameters) {
        Set<Article> articles = Sets.newHashSet();
        OurseSecurityToken ourseSecurityToken = securityHelper.findByToken(token);
        // Je suis admin
        if (securityHelper.hasRoles(ourseSecurityToken, Sets.newHashSet(RolesUtil.ADMINISTRATRICE))) {
            articles.addAll(Article.findToCheckAndDraft(parameters));
        }
        // je suis redac, j'ai accès à mes brouillons
        else if (securityHelper.hasRoles(ourseSecurityToken, Sets.newHashSet(RolesUtil.REDACTRICE))) {
            articles.addAll(Article.findToCheckAndDraft(profileId, parameters));
        }
        return articles;
    }

    @Override
    public Collection<? extends Article> findProfileArticles(Long profileId) {
        Set<Article> articles = Sets.newHashSet();
        if (profileId != null) {
            articles.addAll(Article.findProfileArticles(profileId));
        }
        return articles;
    }
    
    public List<Article> findThreeArticlesWithMostTagsInCommon(long idArticle){
    	//On ramène l'article
    	Article article = Article.findArticle(idArticle);  
    	logger.info("Article: " + article);
    	//On ramène les articles avec la même rubrique
    	Set<Article> articlesMemeRubrique = Article.findRelatedArticles(article.getId(), article.getRubrique().getId());
    	logger.info("Articles related: " + articlesMemeRubrique);
    	return findThreeArticlesWithMostTagsInCommon( article, articlesMemeRubrique);
    }
    
    @VisibleForTesting
    protected List<Article> findThreeArticlesWithMostTagsInCommon(Article article, Set<Article> articlesMemeRubrique){    	
    	Set<Tag> tagsArticle = article.getTags();
    	logger.info("Article tags: " + tagsArticle);
    	LinkedList<RelatedArticle> articlesByNbTags = new LinkedList<RelatedArticle>();
    	//On ramène le nombre de tags en commun
    	for(Article articleMemeRubrique : articlesMemeRubrique){
    		Set<Tag> tagsArticleMemeRubrique = articleMemeRubrique.getTags();
    		logger.info("Tags related: " + tagsArticleMemeRubrique);
    		Integer nbTags = Sets.intersection(tagsArticle, tagsArticleMemeRubrique).size();
    		logger.info("Nb tags en commun: " + nbTags);
    		if(nbTags>0){
    			RelatedArticle relatedArticle = new RelatedArticle(articleMemeRubrique, nbTags);    	
    			logger.info("Article related: " + relatedArticle);
    			articlesByNbTags.add(relatedArticle);
    		}
    	}
    	Collections.sort(articlesByNbTags, new Comparator<RelatedArticle>() {

			@Override
			public int compare(RelatedArticle relatedArticle1, RelatedArticle relatedArticle2) {				
				 return relatedArticle2.getNbTagsInCommon().compareTo(relatedArticle1.getNbTagsInCommon());
			}
		});
    	logger.info("Articles related par nb tags: " + articlesByNbTags);
    	int length = 3;
    	if(articlesByNbTags.size()<3){
    		length = articlesByNbTags.size();
    	}
    	return Lists.transform(articlesByNbTags.subList(0, length), new Function<RelatedArticle, Article>() {

			@Override
			public Article apply(RelatedArticle relatedArticle) {
				return relatedArticle.getArticle();
			}
		});
    }

}
