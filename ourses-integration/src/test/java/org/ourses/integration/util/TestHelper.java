package org.ourses.integration.util;

import java.net.URI;

import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public final class TestHelper {

    public static WebResource webResource(URI uri) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        WebResource webResource = Client.create(cc).resource("http://localhost:8080").path(uri.getPath());
        webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON);
        return webResource;
    }
}
