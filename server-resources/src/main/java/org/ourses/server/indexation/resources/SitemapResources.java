package org.ourses.server.indexation.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ourses.server.indexation.domain.dto.Sitemap;
import org.ourses.server.indexation.helpers.XmlHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/sitemap")
public class SitemapResources {

    @Autowired
    XmlHelper xmlHelper;

    @GET
    @Produces(MediaType.APPLICATION_XML)
    public Sitemap getSitemap() {
        return xmlHelper.buildSitemap();
    }

}
