package org.ourses.server.external;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.ourses.security.github.GithubInfoApi;
import org.ourses.server.external.domain.dto.GithubBug;
import org.springframework.stereotype.Service;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;

@Service
public class GithubRequest {

    public static final String ACCESS_TOKEN = "token ";
    public static final String AUTHORIZATION = "Authorization";

    public ClientResponse addIssue(GithubBug bug) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        Client client = Client.create(cc);
        if (bug == null) {
        	bug = new GithubBug();
        }
        // Basic authentication
        WebResource webResource = client.resource(UriBuilder.fromUri(GithubInfoApi.BUG_TRACKING_URI).build());
        webResource.addFilter(new HTTPBasicAuthFilter(GithubInfoApi.ACCESS_TOKEN, ""));
        return webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON)
                .post(ClientResponse.class, bug);

    }
}
