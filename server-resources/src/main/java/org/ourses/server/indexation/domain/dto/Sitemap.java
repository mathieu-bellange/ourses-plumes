package org.ourses.server.indexation.domain.dto;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "urlset")
public class Sitemap {

    private Set<SitemapUrl> urls = new HashSet<SitemapUrl>();

    @XmlElement(name = "url", type = SitemapUrl.class)
    public Set<SitemapUrl> getUrls() {
        return urls;
    }

    public void setUrls(Set<SitemapUrl> urls) {
        this.urls = urls;
    }

}
