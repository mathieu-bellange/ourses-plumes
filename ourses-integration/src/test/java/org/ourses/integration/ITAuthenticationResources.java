package org.ourses.integration;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.AuthcTokenTest;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.security.domain.dto.LoginDTO;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.WebResource.Builder;

public class ITAuthenticationResources {

    private static final String PATH_AUTHC = "/rest/authc";
    private static final String PATH_AUTHC_CONNECTED = "/rest/authc/connected";

    @Test
    public void shouldAuthc() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").post(
                ClientResponse.class, new LoginDTO("mbellange@gmail.com", "Bellange"));
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
        AuthcTokenTest token = clientResponse.getEntity(AuthcTokenTest.class);
        assertThat(token).isNotNull();
        assertThat(token.getExpirationDate()).isNotNull();
        assertThat(token.getToken()).isNotNull();
    }

    @Test
    public void shouldNotAuthcWithWrongPassword() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").post(
                ClientResponse.class, new LoginDTO("mbellange@gmail.com", "Bellang"));
        assertThat(clientResponse.getStatus()).isEqualTo(Status.UNAUTHORIZED.getStatusCode());
    }

    @Test
    public void shouldAccessAuthenticatedResource() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC_CONNECTED).build();
        Builder clientResource = TestHelper.webResourceWithAuthcToken(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
    }

    @Test
    public void shouldNotAccessAuthenticatedResource() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC_CONNECTED).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.UNAUTHORIZED.getStatusCode());
    }
}
