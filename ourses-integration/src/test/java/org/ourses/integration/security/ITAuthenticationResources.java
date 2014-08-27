package org.ourses.integration.security;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.security.domain.dto.AuthenticatedUserDTO;
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
    private static final String PATH_LOGOUT = "/rest/authc/logout";

    @Test
    public void shouldAuthc() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").post(
                ClientResponse.class, new LoginDTO("mbellange@gmail.com", "Bellange"));
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
        AuthenticatedUserDTO authcUser = clientResponse.getEntity(AuthenticatedUserDTO.class);
        assertThat(authcUser).isNotNull();
        assertThat(authcUser.getAccountId()).isNotNull();
        assertThat(authcUser.getProfileId()).isNotNull();
        assertThat(authcUser.getPseudo()).isNotNull();
        assertThat(authcUser.getToken()).isNotNull();
        assertThat(authcUser.getRole()).isNotNull();
        assertThat(authcUser.getPathAvatar()).isNotNull();
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

    @Test
    public void shouldLogout() {
        URI uri = UriBuilder.fromPath(PATH_LOGOUT).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").post(
                ClientResponse.class, "token_to_delete");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }

    @Test
    public void shouldLogoutWithBadToken() {
        URI uri = UriBuilder.fromPath(PATH_LOGOUT).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").post(
                ClientResponse.class, "bad_token");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }
}
