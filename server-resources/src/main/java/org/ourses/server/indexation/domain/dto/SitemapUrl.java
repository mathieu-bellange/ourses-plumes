package org.ourses.server.indexation.domain.dto;

import java.util.Date;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

import org.ourses.server.indexation.util.DateAdapter;

public class SitemapUrl {

    private String path;
    private Date lastModification;
    private SitemapChangeFreq changeFrequency;
    private Double priority;

    @XmlElement(name = "loc", required = true)
    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @XmlElement(name = "lastmod", required = false)
    @XmlJavaTypeAdapter(DateAdapter.class)
    public Date getLastModification() {
        return lastModification;
    }

    public void setLastModification(Date lastModification) {
        this.lastModification = lastModification;
    }

    @XmlElement(name = "changefreq", required = true)
    public SitemapChangeFreq getChangeFrequency() {
        return changeFrequency;
    }

    public void setChangeFrequency(SitemapChangeFreq changeFrequency) {
        this.changeFrequency = changeFrequency;
    }

    @XmlElement(name = "priority", required = true)
    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

}
