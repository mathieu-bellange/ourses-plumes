package org.ourses.integration.security;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;

public class ITOursesAuthenticationFilter {

    private static final String PATH_ISCONNECTED = "/rest/authc/connected";

    @Test
    public void shouldFilterAllowedRequest() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_ISCONNECTED).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAuthcToken(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(204);
    }

    @Test
    public void shouldFilterNotAllowedRequestWithoutToken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        // pas de token dans la requête
        URI uri = UriBuilder.fromPath(PATH_ISCONNECTED).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldFilterNotAllowedRequestWithWrongToken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        // pas de token dans la requête
        URI uri = UriBuilder.fromPath(PATH_ISCONNECTED).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAuthcToken(uri, "wrong_token").get(
                ClientResponse.class);
        // status attendu 200 redirection
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldFilterNotAllowedRequestWithExpiredToken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        // pas de token dans la requête
        URI uri = UriBuilder.fromPath(PATH_ISCONNECTED).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAuthcToken(uri, "token_bis")
                .get(ClientResponse.class);
        // status attendu 200 redirection
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

}
