package org.ourses.server.redaction.helpers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.text.StrBuilder;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.external.helpers.BitlyHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.domain.entities.OldPath;
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
import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
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

    private static final Set<String> WORD_TO_ESCAPE = Sets.newHashSet("le", "la", "les", "mais", "ou", "et", "donc",
            "or", "ni", "car", "un", "une", "de", "des", "du", "à");

    Logger logger = LoggerFactory.getLogger(ArticleHelperImpl.class);

    @Autowired
    private SecurityHelper securityHelper;

    @Autowired
    private BitlyHelper bitlyHelper;

    @Override
    public boolean isArticleUpdatable(final Long idProfile, final long idArticle, final ArticleStatus status) {
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
    public boolean isArticleReadable(final Long idProfile, final Long idArticle, final ArticleStatus status) {
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
    public boolean isProfileIsTheOwner(final Long idProfile, final long idArticle, final ArticleStatus status) {
        boolean isProfileIsTheOwner = false;
        if (idProfile != null) {
            isProfileIsTheOwner = Article.countArticleByProfileAndStatus(idProfile, idArticle, status) > 0;
        }
        return isProfileIsTheOwner;
    }

    @Override
    public boolean isAdminAndGoodStatusArticle(final Long idProfile, final long idArticle, final ArticleStatus status) {
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
    public void createDraft(final Article article) {
        // place le status à brouillon
        article.setStatus(ArticleStatus.BROUILLON);
        article.setTitleBeautify(beautifyTitle(article.getTitle()));
        article.setCreatedDate(new Date());
        article.setUpdatedDate(new Date());
        for (Tag tag : article.getTags()){
        	if (tag.getId() == null){
        		tag.save();
        	}
        }
        article.save();
        article.updateTags();
        article.updateCoAuthors();
        // créer le path
        article.setPath(buildPath(article));
        article.update("path");
    }

    @Override
    public void updateFromDTO(final Article article, final ArticleDTO articleDTO) {
        BeanUtils.copyProperties(articleDTO, article, new String[] { "category", "rubrique", "profile", "id", "status",
                "tags", "coAuthors" });
        article.setRubrique(articleDTO.getRubrique().toRubrique());
        article.setCategory(articleDTO.getCategory().toCategory());
        // tags
        Set<Tag> oldTags = article.getTags();
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
                	Tag newTag = tag.toTag();
                	newTag.save();
                    tags.add(newTag);
                }
            }
        }
        article.setTags(tags);
        Set<Profile> coAuthors = Sets.newHashSet();
        for (ProfileDTO profile : articleDTO.getCoAuthors()) {
            coAuthors.add(Profile.findPublicProfile(profile.getId()));
        }
        article.setCoAuthors(coAuthors);
        article.setTitleBeautify(beautifyTitle(articleDTO.getTitle()));
        article.setUpdatedDate(new Date());
        article.update("category", "rubrique", "title", "body", "description", "titleBeautify", "updatedDate");
        article.updateCoAuthors();
        article.updateTags();
        if (article.getPath() == null){
        	article.setPath(buildPath(article));
        	article.update("path");
        }
        // suppression des vieux tags
        for (Tag tag : oldTags) {
            if (tag.isUnreferenceByArticles() && !tag.getId().equals(Tag.NO_TAG_ID)) {
                tag.delete();
            }
        }
    }

    @Override
    public Article validateDraft(final long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.AVERIFIER);
        article.setUpdatedDate(new Date());
        article.update("status", "updatedDate");
        return article;
    }

    @Override
    public Article publishArticle(final long id, final Date publishedDate) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.ENLIGNE);
        article.setPath(buildPath(article));
        article.setUpdatedDate(new Date());
        article.setPublishedDate(publishedDate);
        if (article.getTags().isEmpty()){
        	article.setTags(Sets.newHashSet(Tag.find(Tag.NO_TAG_ID)));
        }
        if (article.getCoAuthors().isEmpty()){
        	article.setCoAuthors(Sets.newHashSet(Profile.findPublicProfile(BearAccount.NO_ROLE_ID)));
        }
        // BitlyUrl bitlyUrl = bitlyHelper.shortenUrl("http://"+EnvironnementVariable.DOMAIN_NAME + article.getPath());
        // if (Status.OK.getStatusCode() == bitlyUrl.getStatusCode()) {
        // article.setShortenedUrl(bitlyUrl.getData().getUrl());
        // }
        article.update("status", "path", "updatedDate", "publishedDate");
        article.updateCoAuthors();
        article.updateTags();
        return article;
    }

    @Override
    public Article invalidateArticle(final long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.BROUILLON);
        article.setUpdatedDate(new Date());
        article.update("status", "updatedDate");
        return article;
    }

    @Override
    public Article recallArticle(final long id) {
        Article article = Article.findArticle(id);
        article.setStatus(ArticleStatus.AVERIFIER);
        OldPath oldPath = new OldPath();
        oldPath.setPath(article.getPath());
        // oldPath.save();
        article.getOldPath().add(oldPath);
        article.setPath(buildPath(article));
        article.setUpdatedDate(new Date());
        article.setPublishedDate(null);
        article.update("status", "path", "updatedDate", "publishedDate", "oldPath");
        return article;
    }

    /**
     * Construit un titre allégé de tous ses caractères spéciaux
     * 
     * @param title
     * @return
     */
    protected String beautifyTitle(final String title) {
        StrBuilder path = new StrBuilder();
        String[] tokens = StringUtils.stripAccents(title).split("\\W");
        for (String token : tokens) {
            if (!token.isEmpty()) {
                path.appendSeparator(URL_SEPARATOR);
                path.append(token.toLowerCase());
            }
        }
        return path.toString();

    }

    @Override
    public String buildPath(final Article article) {
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
            pathBuilder.append("/" + new Date().getTime());
            pathBuilder.append("/" + beautifyTitle(article.getTitle()));
            break;
        default:
            break;
        }
        return pathBuilder.toString();
    }

    @Override
    public void delete(final Article article) {
        if (!article.getCoAuthors().isEmpty()) {
            article.getCoAuthors().clear();
            article.updateCoAuthors();
        }
        Set<Tag> tagsToDelete = article.getTags();
        article.delete();
        for (Tag tag : tagsToDelete) {
            if (tag.isUnreferenceByArticles()) {
                tag.delete();
            }
        }
    }

    @Override
    public boolean isTitleAlreadyTaken(final String title, final Long id) {
        return Article.articleWithSameTitleBeautify(beautifyTitle(title), id) > 0;
    }

    @Override
    public Collection<? extends Article> findOnline(final String parameter, int page) {
        List<String> parameters = new ArrayList<>();
        if (parameter != null) {
            parameters.addAll(processParameters(parameter));
        }
        return Article.findOnline(parameters, page);
    }

    @VisibleForTesting
    protected Collection<String> processParameters(final String parameters) {
        return Collections2.transform(
                Collections2.filter(Sets.newHashSet(parameters.split(" ")), new Predicate<String>() {

                    @Override
                    public boolean apply(final String parameter) {
                        return !WORD_TO_ESCAPE.contains(parameter.toLowerCase());
                    }
                }), new Function<String, String>() {

                    @Override
                    public String apply(final String parameter) {
                        return parameter.toLowerCase();
                    }
                });
    }

    @Override
    public Collection<? extends Article> findToCheckAndDraftAndPublished(final Long profileId, final String token, int page) {
        List<Article> articles = new ArrayList<Article>();
        OurseSecurityToken ourseSecurityToken = securityHelper.findByToken(token);
        // Je suis admin
        if (securityHelper.hasRoles(ourseSecurityToken, Sets.newHashSet(RolesUtil.ADMINISTRATRICE))) {
            articles.addAll(Article.findToCheckAndDraftAndPublished(page));
        }
        // je suis redac, j'ai accès à mes brouillons
        else if (securityHelper.hasRoles(ourseSecurityToken, Sets.newHashSet(RolesUtil.REDACTRICE))) {
            articles.addAll(Article.findToCheckAndDraftAndPublished(profileId, page));
        }
        return articles;
    }

    @Override
    public Collection<? extends Article> findProfileArticles(final Long profileId) {
        Set<Article> articles = Sets.newHashSet();
        if (profileId != null) {
            articles.addAll(Article.findProfileArticles(profileId));
        }
        return articles;
    }

    @Override
    public List<Article> findThreeArticlesWithMostTagsInCommon(final long idArticle) {
        // On ramène l'article
        Article article = Article.findArticle(idArticle);
        logger.info("Article: " + article);
        // On ramène les articles avec la même rubrique
        Set<Article> articlesMemeRubrique = Article.findRelatedArticles(article.getId());
        logger.info("Articles related: " + articlesMemeRubrique);
        return findThreeArticlesWithMostTagsInCommon(article, articlesMemeRubrique);
    }

    @VisibleForTesting
    protected List<Article> findThreeArticlesWithMostTagsInCommon(final Article article, final Set<Article> articles) {
        Set<Tag> tagsArticle = article.getTags();
        // ajout le fait que la rubrique est un tag
        tagsArticle.add(new Tag(article.getRubrique().getId(), article.getRubrique().getRubrique().toLowerCase()));
        logger.info("Article tags: " + tagsArticle);
        LinkedList<RelatedArticle> articlesByNbTags = new LinkedList<RelatedArticle>();
        // On ramène le nombre de tags en commun
        for (Article art : articles) {
            Set<Tag> tagsArt = art.getTags();
            // ajout le fait que la rubrique est un tag
            tagsArt.add(new Tag(art.getRubrique().getId(), art.getRubrique().getRubrique().toLowerCase()));
            logger.info("Tags related: " + tagsArt);
            Integer nbTags = Sets.intersection(tagsArt, tagsArticle).size();
            logger.info("Nb tags en commun: " + nbTags);
            if (nbTags > 0) {
                RelatedArticle relatedArticle = new RelatedArticle(art, nbTags);
                logger.info("Article related: " + relatedArticle);
                articlesByNbTags.add(relatedArticle);
            }
        }
        Collections.sort(articlesByNbTags, new Comparator<RelatedArticle>() {

            @Override
            public int compare(final RelatedArticle relatedArticle1, final RelatedArticle relatedArticle2) {
                return relatedArticle2.getNbTagsInCommon().compareTo(relatedArticle1.getNbTagsInCommon());
            }
        });
        logger.info("Articles related par nb tags: " + articlesByNbTags);
        int length = 3;
        if (articlesByNbTags.size() < 3) {
            length = articlesByNbTags.size();
        }
        return Lists.transform(articlesByNbTags.subList(0, length), new Function<RelatedArticle, Article>() {

            @Override
            public Article apply(final RelatedArticle relatedArticle) {
                return relatedArticle.getArticle();
            }
        });
    }

    @Override
    public List<Article> findLastPublishedArticle() {
        return Article.findLastPublishedArticle();
    }

    @Override
    public Article findLastWebReview() {
        return Article.findLastWebReview();
    }

    @Override
    public Article findOnlineArticle(final String rubrique, final String title, final long dateLong) {
        String path = "/articles/" + rubrique + "/" + dateLong + "/" + title;
        Article art = Article.findArticleByPath(path);
        if (art == null) {
            art = Article.findArticleByOldPath(path);
        }
        return art;
    }

	@Override
	public Collection<ArticleDTO> transformIntoPartial(Collection<? extends Article> articles) {
		 Collection<ArticleDTO> articlesDTO = Collections2.transform(articles, new Function<Article, ArticleDTO>() {

	            @Override
	            public ArticleDTO apply(final Article article) {
	                return article.toPartialArticleDTO();
	            }
	        });
		return articlesDTO;
	}

	@Override
	public Collection<ArticleDTO> transformIntoFull(Collection<? extends Article> articles) {
		 Collection<ArticleDTO> articlesDTO = Collections2.transform(articles, new Function<Article, ArticleDTO>() {

	            @Override
	            public ArticleDTO apply(final Article article) {
	                return article.toFullArticleDTO();
	            }
	        });
		return articlesDTO;
	}

}
