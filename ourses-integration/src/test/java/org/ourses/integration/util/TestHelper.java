package org.ourses.integration.util;

import java.net.URI;

import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;

public final class TestHelper {

    public static WebResource webResource(URI uri) {
        return getWebResource(Client.create(new DefaultClientConfig(JacksonJsonProvider.class)), uri);
    }

    public static WebResource webResourceWithCredential(URI uri, String login, String password) {
        Client client = Client.create(new DefaultClientConfig(JacksonJsonProvider.class));
        client.addFilter(new HTTPBasicAuthFilter(login, password));
        return getWebResource(client, uri);
    }

    public static WebResource webResourceWithAuthcToken(URI uri) {
        return webResourceWithAuthcToken(uri, "token");
    }

    public static WebResource webResourceWithAuthcToken(URI uri, String token) {
        Client client = Client.create(new DefaultClientConfig(JacksonJsonProvider.class));
        client.addFilter(new HTTPBasicAuthFilter(token, ""));
        return getWebResource(client, uri);
    }

    private static WebResource getWebResource(Client client, URI uri) {
        WebResource webResource = client.resource("http://localhost:8080").path(uri.getPath());
        webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON);
        return webResource;
    }
}
