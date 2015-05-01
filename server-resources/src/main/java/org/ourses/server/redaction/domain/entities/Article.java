package org.ourses.server.redaction.domain.entities;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.joda.time.DateTime;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.ExpressionList;
import com.google.common.collect.Sets;

@Entity
@Component
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class Article implements Serializable {

    /**
	 * 
	 */
    private static final long serialVersionUID = -6748991147610491255L;

	private static final int ARTICLE_PAGE_SIZE = 8;

    static Logger logger = LoggerFactory.getLogger(Article.class);

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "article_seq_gen")
    @SequenceGenerator(name = "article_seq_gen", sequenceName = "article_seq")
    private Long id;
    private String title;
    private String description;
    private String body;
    private Date createdDate;
    private Date updatedDate;
    private Date publishedDate;
    private String path;
    private String titleBeautify;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private Category category;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private Rubrique rubrique;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "ARTICLE_TAG", joinColumns = @JoinColumn(name = "ARTICLE_ID"), inverseJoinColumns = @JoinColumn(name = "TAG_ID"))
    private Set<Tag> tags;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private Profile profile;
    @Enumerated(EnumType.ORDINAL)
    private ArticleStatus status;
    @ManyToMany
    @JoinTable(name = "ARTICLE_COAUTHOR", joinColumns = @JoinColumn(name = "ARTICLE_ID"), inverseJoinColumns = @JoinColumn(name = "PROFILE_ID"))
    private Set<Profile> coAuthors;
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ARTICLE_ID")
    private Set<OldPath> oldPath = Sets.newHashSet();

    // private String shortenedUrl;

    public Article() {
    }

    public Article(final Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(final String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getBody() {
        return body;
    }

    public void setBody(final String body) {
        this.body = body;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(final Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(final Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Date getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(final Date publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getPath() {
        return path;
    }

    public void setPath(final String path) {
        this.path = path;
    }

    public String getTitleBeautify() {
        return titleBeautify;
    }

    public void setTitleBeautify(final String titleBeautify) {
        this.titleBeautify = titleBeautify;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(final Category category) {
        this.category = category;
    }

    public Rubrique getRubrique() {
        return rubrique;
    }

    public void setRubrique(final Rubrique rubrique) {
        this.rubrique = rubrique;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(final Set<Tag> tags) {
        this.tags = tags;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(final Profile profile) {
        this.profile = profile;
    }

    public ArticleStatus getStatus() {
        return status;
    }

    public void setStatus(final ArticleStatus status) {
        this.status = status;
    }

    public Set<Profile> getCoAuthors() {
        return coAuthors;
    }

    public void setCoAuthors(final Set<Profile> coAuthors) {
        this.coAuthors = coAuthors;
    }

    public void setOldPath(final Set<OldPath> oldPath) {
        this.oldPath = oldPath;
    }

    public Set<OldPath> getOldPath() {
        return oldPath;
    }

    //
    // public String getShortenedUrl() {
    // return shortenedUrl;
    // }
    //
    // public void setShortenedUrl(final String shortenedUrl) {
    // this.shortenedUrl = shortenedUrl;
    // }

    public void save() {
        Ebean.save(this);
        Ebean.saveManyToManyAssociations(this, "coAuthors");
    }

    public static int countArticleByProfileAndStatus(final long idProfile, final long idArticle,
            final ArticleStatus status) {
        return Ebean.find(Article.class).where().eq("profile.id", idProfile).eq("id", idArticle).eq("status", status)
                .findRowCount();
    }

    public static int countArticleByStatus(final long idArticle, final ArticleStatus status) {
        return Ebean.find(Article.class).where().eq("id", idArticle).eq("status", status).findRowCount();
    }

    public static Collection<? extends Article> findToCheckAndDraftAndPublished(int page) {
        return Ebean.find(Article.class).orderBy().asc("status").orderBy().desc("publishedDate").orderBy()
                .desc("updatedDate").orderBy().desc("createdDate").findPagingList(ARTICLE_PAGE_SIZE).getPage(page).getList();
    }

    public static Collection<? extends Article> findToCheckAndDraftAndPublished(Long profileId, final int page) {
        return Ebean.find(Article.class).where()
                .eq("profile.id", profileId).orderBy().asc("status").orderBy().desc("publishedDate").orderBy()
                .desc("updatedDate").orderBy().desc("createdDate").findPagingList(ARTICLE_PAGE_SIZE).getPage(page).getList();
    }
    
    public static Collection<? extends Article> findToCheckAndDraftAndPublished(
			Long profileId) {
		return Ebean.find(Article.class).fetch("profile", "pseudo").fetch("coAuthors", "pseudo").where()
                .eq("profile.id", profileId).findSet();
	}

    public static Collection<? extends Article> findAllCoAuthorsArticle(final Long idProfile) {
        return Ebean.find(Article.class).fetch("profile", "pseudo").fetch("coAuthors", "pseudo").where()
                .eq("coAuthors.id", idProfile).findSet();
    }

    public static Collection<? extends Article> findProfileArticles(final Long profileId) {
        Set<Article> set = Sets.newHashSet();
        set.addAll(Ebean.find(Article.class).fetch("rubrique").where().eq("profile.id", profileId)
                .eq("status", ArticleStatus.ENLIGNE).le("publishedDate", DateTime.now().toDate()).findSet());
        set.addAll(Ebean.find(Article.class).fetch("rubrique").where().eq("coAuthors.id", profileId)
                .eq("status", ArticleStatus.ENLIGNE).le("publishedDate", DateTime.now().toDate()).findSet());
        return set;
    }

    public static List<Article> findOnline(final Collection<String> collection, int page) {
        ExpressionList<Article> expr;

        if (collection != null && !collection.isEmpty()) {
            expr = Ebean.find(Article.class).fetch("rubrique").where().eq("status", ArticleStatus.ENLIGNE)
                    .le("publishedDate", DateTime.now().toDate()).disjunction();
            for (String parameter : collection) {
                expr.ilike("titleBeautify", "%" + parameter + "%");
                expr.ilike("tags.tag", "%" + parameter + "%");
                expr.ilike("rubrique.path", "%" + parameter + "%");
            }
        }
        else {
            expr = Ebean.find(Article.class).where().eq("status", ArticleStatus.ENLIGNE)
                    .le("publishedDate", DateTime.now().toDate());
        }
        return expr.orderBy().desc("publishedDate").findPagingList(ARTICLE_PAGE_SIZE).getPage(page).getList();
    }
    
    public static Collection<? extends Article> findOnline() {
		return Ebean.find(Article.class).fetch("rubrique").where().eq("status", ArticleStatus.ENLIGNE)
                .le("publishedDate", DateTime.now().toDate()).findSet();
	}

    public static Article findArticle(final long id) {
        return Ebean.find(Article.class).fetch("profile").fetch("category").fetch("rubrique").fetch("tags")
                .fetch("coAuthors").fetch("oldPath").where().eq("id", id).findUnique();
    }

    public static Article findArticleByPath(final String path) {
        return Ebean.find(Article.class).fetch("profile").fetch("category").fetch("rubrique").fetch("tags")
                .fetch("coAuthors").where().eq("path", path).le("publishedDate", DateTime.now().toDate()).findUnique();
    }

    public static Article findArticleByOldPath(final String path) {
        return Ebean.find(Article.class).fetch("profile").fetch("category").fetch("rubrique").fetch("tags")
                .fetch("coAuthors").where().eq("oldPath.path", path).le("publishedDate", DateTime.now().toDate())
                .findUnique();
    }

    public static int articleWithSameTitleBeautify(final String titleBeautify, final Long id) {
        ExpressionList<Article> query = Ebean.find(Article.class).where().eq("titleBeautify", titleBeautify);
        if (id != null) {
            query.ne("id", id);
        }
        return query.findRowCount();
    }

    public static Set<Article> findRelatedArticles(final long idArticle) {
        return Ebean.find(Article.class).fetch("rubrique").fetch("tags").where().ne("id", idArticle)
                .eq("status", ArticleStatus.ENLIGNE).le("publishedDate", new Date()).findSet();
    }

    public static List<Article> findLastPublishedArticle() {
        return Ebean.find(Article.class).fetch("rubrique").where().eq("status", ArticleStatus.ENLIGNE)
                .le("publishedDate", new Date()).orderBy().desc("publishedDate").setMaxRows(6).findList();
    }

    public static Article findLastWebReview() {
        return Ebean.find(Article.class).fetch("rubrique").where().eq("status", ArticleStatus.ENLIGNE)
                .le("publishedDate", new Date()).eq("category.id", 6l).orderBy().desc("publishedDate").setMaxRows(1)
                .findUnique();
    }

    public static Set<Article> findToCheck() {
        return Ebean.find(Article.class).where().eq("status", ArticleStatus.AVERIFIER).findSet();
    }

    public void update(final String... properties) {
        Ebean.update(this, Sets.newHashSet(properties));
    }

    public void updateCoAuthors() {
        Ebean.saveManyToManyAssociations(this, "coAuthors");
    }

    public void delete() {
        Ebean.delete(this);
    }

    public ArticleDTO toArticleDTO() {
        ArticleDTO articleDTO = new ArticleDTO();
        BeanUtils.copyProperties(this, articleDTO, new String[] { "category", "rubrique", "profile", "tags",
                "coAuthors" });
        // category ne peut pas être null
        CategoryDTO categoryDTO = this.category.toCategoryDTO();
        articleDTO.setCategory(categoryDTO);
        // rubrique ne peut pas être null
        RubriqueDTO rubriqueDTO = this.rubrique.toRubriqueDTO();
        articleDTO.setRubrique(rubriqueDTO);
        // profile ne peut pas être null
        ProfileDTO profileDTO = this.profile.toProfileDTO();
        articleDTO.setProfile(profileDTO);
        Set<TagDTO> tags = Sets.newHashSet();
        for (Tag tag : this.tags) {
            tags.add(tag.toTagDTO());
        }
        articleDTO.setTags(tags);
        if (coAuthors != null) {
            Set<ProfileDTO> coAuthorsDTO = Sets.newHashSet();
            for (Profile profile : this.coAuthors) {
                coAuthorsDTO.add(profile.toProfileDTO());
            }
            articleDTO.setCoAuthors(coAuthorsDTO);
        }
        return articleDTO;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Article other = (Article) obj;
        if (id == null) {
            if (other.id != null) {
                return false;
            }
        }
        else if (!id.equals(other.id)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }
}
