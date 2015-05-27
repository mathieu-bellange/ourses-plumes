package org.ourses.server.indexation.domain.dto;

import java.util.ArrayList;
import java.util.List;

import org.ourses.server.redaction.domain.dto.RubriqueDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticlesStatisticDTO {

	private RubriqueDTO rubrique;
	
	private List<ArticlePageStatisticDTO> articlesStat = new ArrayList<ArticlePageStatisticDTO>();

	public RubriqueDTO getRubrique() {
		return rubrique;
	}

	public void setRubrique(RubriqueDTO rubrique) {
		this.rubrique = rubrique;
	}

	public List<ArticlePageStatisticDTO> getArticlesStat() {
		return articlesStat;
	}

	public void setArticlesStat(List<ArticlePageStatisticDTO> articlesStat) {
		this.articlesStat = articlesStat;
	}
}
