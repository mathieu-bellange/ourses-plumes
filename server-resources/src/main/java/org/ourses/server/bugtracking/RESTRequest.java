package org.ourses.server.bugtracking;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.ourses.security.github.GithubInfoApi;
import org.springframework.stereotype.Service;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.representation.Form;

@Service
public class RESTRequest {

    public static final String ACCESS_TOKEN = "access_token";

    public ClientResponse post(String uri, Form formulaire) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        Client client = Client.create(cc);
        if (formulaire == null) {
            formulaire = new Form();
        }
        WebResource webResource = client.resource(UriBuilder.fromUri(uri).build());
        return webResource.header("Authorization", "token " + GithubInfoApi.ACCESS_TOKEN)
                .type(MediaType.APPLICATION_FORM_URLENCODED).accept(MediaType.APPLICATION_JSON_TYPE)
                .post(ClientResponse.class, formulaire);

    }
}
