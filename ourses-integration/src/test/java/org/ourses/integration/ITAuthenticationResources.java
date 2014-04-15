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

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;

public class ITAuthenticationResources {

    private static final String PATH_AUTHC = "/rest/authc";

    @Test
    public void shouldAuthc() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC).build();
        WebResource clientResource = TestHelper.webResourceWithCredential(uri, "mbellange@gmail.com", "Bellange");
        ClientResponse clientResponse = clientResource.post(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
        AuthcTokenTest token = clientResponse.getEntity(AuthcTokenTest.class);
        assertThat(token).isNotNull();
        assertThat(token.getExpirationDate()).isNotNull();
        assertThat(token.getToken()).isNotNull();
        // second authc test de la maj du token
        clientResponse = clientResource.post(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
        AuthcTokenTest tokenBis = clientResponse.getEntity(AuthcTokenTest.class);
        assertThat(tokenBis).isNotNull();
        assertThat(tokenBis.getExpirationDate().after(token.getExpirationDate())).isTrue();
        assertThat(tokenBis.getToken()).isNotEqualTo(token.getToken());
    }

    @Test
    public void shouldNotAuthc() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_AUTHC).build();
        WebResource clientResource = TestHelper.webResourceWithCredential(uri, "mbellange@gmail.com", "Bellang");
        ClientResponse clientResponse = clientResource.post(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.UNAUTHORIZED.getStatusCode());
    }
}
