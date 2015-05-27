package org.ourses.server.indexation.domain.dto;

import java.util.ArrayList;
import java.util.List;

import org.ourses.server.redaction.domain.dto.ArticleDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticlePageStatisticDTO {
	
	private ArticleDTO article;
	
	private List<WebSiteStatisticDTO> statistics = new ArrayList<WebSiteStatisticDTO>();

	public ArticleDTO getArticle() {
		return article;
	}

	public void setArticle(ArticleDTO article) {
		this.article = article;
	}

	public List<WebSiteStatisticDTO> getStatistics() {
		return statistics;
	}

	public void setStatistics(List<WebSiteStatisticDTO> statistics) {
		this.statistics = statistics;
	}

}
