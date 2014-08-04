package org.ourses.server.redaction.domain.dto;

import java.util.Date;
import java.util.Set;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.ArticleStatus;
import org.ourses.server.redaction.domain.entities.Category;
import org.ourses.server.redaction.domain.entities.Rubrique;
import org.ourses.server.redaction.domain.entities.Tag;
import org.springframework.beans.BeanUtils;

import com.google.common.collect.Sets;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDTO {

    @JsonProperty("id")
    private Long id;
    @JsonProperty("title")
    private String title;
    @JsonProperty("description")
    private String description;
    @JsonProperty("body")
    private String body;
    @JsonProperty("createdDate")
    private Date createdDate;
    @JsonProperty("updatedDate")
    private Date updatedDate;
    @JsonProperty("publishedDate")
    private Date publishedDate;
    @JsonProperty("category")
    private CategoryDTO category;
    @JsonProperty("rubrique")
    private RubriqueDTO rubrique;
    @JsonProperty("profile")
    private ProfileDTO profile;
    @JsonProperty("status")
    private ArticleStatus status;
    @JsonProperty("path")
    private String path;
    @JsonProperty("titleBeautify")
    private String titleBeautify;
    @JsonProperty("tags")
    private Set<TagDTO> tags = Sets.newHashSet();

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

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Date getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(Date publishedDate) {
        this.publishedDate = publishedDate;
    }

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }

    public RubriqueDTO getRubrique() {
        return rubrique;
    }

    public void setRubrique(RubriqueDTO rubrique) {
        this.rubrique = rubrique;
    }

    public ProfileDTO getProfile() {
        return profile;
    }

    public void setProfile(ProfileDTO profile) {
        this.profile = profile;
    }

    public ArticleStatus getStatus() {
        return status;
    }

    public void setStatus(ArticleStatus status) {
        this.status = status;
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

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

    public Article toArticle() {
        Article article = new Article();
        BeanUtils.copyProperties(this, article, new String[] { "category", "rubrique", "profile", "tags" });
        Category cat = this.category.toCategory();
        article.setCategory(cat);
        Rubrique rubrique = this.rubrique.toRubrique();
        article.setRubrique(rubrique);
        Set<Tag> tags = Sets.newHashSet();
        for (TagDTO tag : this.tags) {
            tags.add(tag.toTag());
        }
        article.setTags(tags);
        // le profil ne transit pas depuis le client
        return article;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
