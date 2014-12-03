package org.ourses.server.redaction.domain.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;

@Entity
public class OldPath {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "old_path_seq_gen")
    @SequenceGenerator(name = "old_path_seq_gen", sequenceName = "old_path_seq")
    private Long id;
    private String path;
    @ManyToOne
    private Article article;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    // public void save() {
    // Ebean.save(this);
    // }
}
