package org.ourses.server.redaction.domain.utils;

import org.ourses.server.redaction.domain.entities.Article;

public class RelatedArticle {

	private Article article;
	private Integer nbTagsInCommon;

	public RelatedArticle(Article article, Integer nbTagsInCommon) {
		super();
		this.article = article;
		this.nbTagsInCommon = nbTagsInCommon;
	}
	public Article getArticle() {
		return article;
	}
	public void setArticle(Article article) {
		this.article = article;
	}
	public Integer getNbTagsInCommon() {
		return nbTagsInCommon;
	}
	public void setNbTagsInCommon(Integer nbTagsInCommon) {
		this.nbTagsInCommon = nbTagsInCommon;
	}
}
