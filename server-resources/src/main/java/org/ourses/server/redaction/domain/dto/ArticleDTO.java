package org.ourses.server.redaction.domain.dto;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.redaction.domain.entities.Category;
import org.ourses.server.redaction.domain.entities.Rubrique;
import org.springframework.beans.BeanUtils;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDTO {

    @JsonProperty("title")
    private String title;
    @JsonProperty("description")
    private String description;
    @JsonProperty("body")
    private String body;
    @JsonProperty("category")
    private CategoryDTO category;
    @JsonProperty("rubrique")
    private RubriqueDTO rubrique;
    @JsonProperty("profile")
    private ProfileDTO profile;

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

    public Article toArticle() {
        Article article = new Article();
        BeanUtils.copyProperties(this, article, new String[] { "category", "rubrique", "profile" });
        Category cat = this.category.toCategory();
        article.setCategory(cat);
        Rubrique rubrique = this.rubrique.toRubrique();
        article.setRubrique(rubrique);
        // le profil ne transit pas depuis le client
        return article;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
    }

}
