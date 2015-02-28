package org.ourses.server.indexation.helpers;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.ourses.server.indexation.domain.dto.Sitemap;
import org.ourses.server.indexation.domain.dto.SitemapChangeFreq;
import org.ourses.server.indexation.domain.dto.SitemapUrl;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.util.EnvironnementVariable;
import org.springframework.stereotype.Component;

import com.google.common.collect.Sets;

@Component
public class XmlHelperImpl implements XmlHelper {

    @Override
    public Sitemap buildSitemap() {
        Sitemap sitemap = new Sitemap();
        sitemap.getUrls().addAll(buildStaticSitemapUrl());
        sitemap.getUrls().addAll(buildArticlesSitemapUrl());
        return sitemap;
    }

    private Collection<? extends SitemapUrl> buildArticlesSitemapUrl() {
        Set<Article> articles = Article.findOnline(null);
        Set<SitemapUrl> articlesUrl = new HashSet<SitemapUrl>();
        for (Article art : articles) {
            SitemapUrl artUrl = new SitemapUrl();
            artUrl.setChangeFrequency(SitemapChangeFreq.YEARLY);
            artUrl.setPriority(1.0);
            artUrl.setLastModification(art.getPublishedDate());
            artUrl.setPath("http://"+ EnvironnementVariable.DOMAIN_NAME + art.getPath());
            articlesUrl.add(artUrl);
        }
        return articlesUrl;
    }

    private Collection<? extends SitemapUrl> buildStaticSitemapUrl() {
        SitemapUrl homeUrl = new SitemapUrl();
        homeUrl.setPath("http://"+ EnvironnementVariable.DOMAIN_NAME);
        homeUrl.setChangeFrequency(SitemapChangeFreq.DAILY);
        homeUrl.setPriority(0.8);
        SitemapUrl faqUrl = new SitemapUrl();
        faqUrl.setPath("http://"+ EnvironnementVariable.DOMAIN_NAME + "/faq");
        faqUrl.setChangeFrequency(SitemapChangeFreq.MONTHLY);
        faqUrl.setPriority(0.5);
        return Sets.newHashSet(homeUrl, faqUrl);
    }

}
