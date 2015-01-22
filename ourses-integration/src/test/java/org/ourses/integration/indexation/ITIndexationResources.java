package org.ourses.integration.indexation;

import static org.fest.assertions.Assertions.assertThat;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriBuilder;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.core.util.MultivaluedMapImpl;

public class ITIndexationResources {

    private static final String PATH_SITEMAP = "/sitemap.xml";
    private static final String PATH_CRAWL_URL = "/";

    @Test
    public void shouldReadSitemap() {
        URI uri = UriBuilder.fromPath(PATH_SITEMAP).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        String sitemap = clientResponse.getEntity(String.class);
        System.out.println(sitemap);
        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
        try {
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            Document doc = docBuilder.parse(new InputSource(new ByteArrayInputStream(sitemap.getBytes("utf-8"))));
            Node urlsetNode = doc.getFirstChild();
            assertThat(urlsetNode.getNodeName()).isEqualTo("urlset");
            assertThat(urlsetNode.getAttributes().getNamedItem("xmlns").getNodeValue()).isEqualTo(
                    "http://www.sitemaps.org/schemas/sitemap/0.9");
            for (int index = 0; index < urlsetNode.getChildNodes().getLength(); index++) {
                Node urlNode = urlsetNode.getChildNodes().item(index);
                assertThat(urlNode.getNodeName()).isEqualTo("url");
                for (int index2 = 0; index2 < urlNode.getChildNodes().getLength(); index2++) {
                    Node urlChildNode = urlNode.getChildNodes().item(index2);
                    assertThat(urlChildNode.getNodeName()).isIn("loc", "lastmod", "changefreq", "priority");
                }
            }
        }
        catch (SAXException | IOException | ParserConfigurationException e) {
            e.printStackTrace();
            assertThat(true).isFalse();
        }
    }

    @Test
    public void shouldCrawlHomePage() {
        URI uri = UriBuilder.fromPath(PATH_CRAWL_URL).build();
        MultivaluedMap<String, String> params = new MultivaluedMapImpl();
        params.add("_escaped_fragment_", "");
        ClientResponse clientResponse = TestHelper.webResource(uri).queryParams(params).get(ClientResponse.class);
        // status attendu 200
        // assertThat(clientResponse.getStatus()).isEqualTo(200);
        String homePage = clientResponse.getEntity(String.class);
        System.out.println(homePage);
    }
}
