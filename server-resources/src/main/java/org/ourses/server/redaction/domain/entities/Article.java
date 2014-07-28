package org.ourses.server.redaction.domain.entities;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.ourses.server.redaction.domain.dto.TagDTO;
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

    @Id
    @GeneratedValue
    private Long id;
    private String title;
    private String description;
    private String body;
    private Date publishedDate;
    private String path;
    private String titleBeautify;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private Category category;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private Rubrique rubrique;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "ARTICLE_TAG", joinColumns = @JoinColumn(name = "ARTICLE_ID"), inverseJoinColumns = @JoinColumn(name = "TAG_ID"))
    private Set<Tag> tags;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    private Profile profile;
    @Enumerated(EnumType.ORDINAL)
    private ArticleStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Date getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(Date publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getTitleBeautify() {
        return titleBeautify;
    }

    public void setTitleBeautify(String titleBeautify) {
        this.titleBeautify = titleBeautify;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Rubrique getRubrique() {
        return rubrique;
    }

    public void setRubrique(Rubrique rubrique) {
        this.rubrique = rubrique;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public ArticleStatus getStatus() {
        return status;
    }

    public void setStatus(ArticleStatus status) {
        this.status = status;
    }

    public void save() {
        Ebean.save(this);
    }

    public static int countArticleByProfileAndStatus(long idProfile, long idArticle, ArticleStatus status) {
        return Ebean.find(Article.class).where().eq("profile.id", idProfile).eq("id", idArticle).eq("status", status)
                .findRowCount();
    }

    public static int countArticleByStatus(long idArticle, ArticleStatus status) {
        return Ebean.find(Article.class).where().eq("id", idArticle).eq("status", status).findRowCount();
    }

    public static Set<Article> findDrafts(long idProfile) {
        return Ebean.find(Article.class).where().eq("profile.id", idProfile).eq("status", ArticleStatus.BROUILLON)
                .findSet();
    }

    public static Set<Article> findToCheck() {
        return Ebean.find(Article.class).where().eq("status", ArticleStatus.AVERIFIER).findSet();
    }

    public static Set<Article> findOnline() {
        return Ebean.find(Article.class).where().eq("status", ArticleStatus.ENLIGNE).findSet();
    }

    public static Article findArticle(long id) {
        return Ebean.find(Article.class).fetch("profile").fetch("category").fetch("rubrique").fetch("tags").where()
                .eq("id", id).findUnique();
    }

    public static Article findArticleByRubriqueAndBeautifyTitle(String rubrique, String titleBeautify) {
        return Ebean.find(Article.class).fetch("profile").fetch("category").fetch("rubrique").fetch("tags").where()
                .eq("rubrique.path", rubrique).eq("titleBeautify", titleBeautify).findUnique();
    }

    public static int articleWithSameTitleBeautify(String titleBeautify, Long id) {
        ExpressionList<Article> query = Ebean.find(Article.class).where().eq("titleBeautify", titleBeautify);
        if (id != null) {
            query.ne("id", id);
        }
        return query.findRowCount();
    }

    public void update(String... properties) {
        Ebean.update(this, Sets.newHashSet(properties));
    }

    public void delete() {
        Ebean.delete(this);
    }

    public ArticleDTO toArticleDTO() {
        ArticleDTO articleDTO = new ArticleDTO();
        BeanUtils.copyProperties(this, articleDTO, new String[] { "category", "rubrique", "profile" });
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
        return articleDTO;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
