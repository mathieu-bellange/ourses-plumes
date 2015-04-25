package org.ourses.integration.util;

import java.net.URI;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;



import com.fasterxml.jackson.jaxrs.json.JacksonJsonProvider;
import com.google.common.net.HttpHeaders;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.WebResource.Builder;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public final class TestHelper {

    public static WebResource webResource(URI uri) {
        return getWebResource(Client.create(new DefaultClientConfig(JacksonJsonProvider.class)), uri);
    }

    public static Builder webResourceWithAdminRole(URI uri) {
        return webResourceWithAuthcToken(uri, "admin");
    }

    public static Builder webResourceWithRedacRole(URI uri) {
        return webResourceWithAuthcToken(uri, "redac");
    }

    public static Builder webResourceWithAuthcToken(URI uri) {
        return webResourceWithAuthcToken(uri, "token");
    }

    public static Builder webResourceWithAuthcToken(URI uri, String token) {
        Client client = Client.create(new DefaultClientConfig(JacksonJsonProvider.class));
        return getWebResource(client, uri).header(HttpHeaders.AUTHORIZATION, token);
    }

    public static Builder webResourceWithRedacRoleAndParams(URI uri, MultivaluedMap<String, String> params) {
        Client client = Client.create(new DefaultClientConfig(JacksonJsonProvider.class));
        return getWebResource(client, uri).queryParams(params).header(HttpHeaders.AUTHORIZATION, "redac");
    }

    private static WebResource getWebResource(Client client, URI uri) {
        WebResource webResource = client.resource("http://localhost:8080").path(uri.getPath());
        webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON);
        return webResource;
    }
}
