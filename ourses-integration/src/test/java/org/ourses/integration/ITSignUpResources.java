package org.ourses.integration;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;
import com.sun.jersey.api.client.UniformInterfaceException;

public class ITSignUpResources {

    private static final String PATH_CHECK_PSEUDO = "/rest/signup_check/pseudo";
    private static final String PATH_CHECK_MAIL = "/rest/signup_check/mail";
    private static final String PATH_CHECK_PASSWORD = "/rest/signup_check/password";

    /* Test sur le pseudo */

    @Test
    public void shouldWarnPseudoAlreadyTaken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_PSEUDO).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "jpetit");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldWarnPseudoEmpty() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_PSEUDO).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldGreetNewPseudo() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_PSEUDO).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "foufy");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }

    /* Test sur le mail */

    @Test
    public void shouldWarnMailAlreadyTaken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_MAIL).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "jpetit@gmail.com");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldWarnMailNotValid() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_MAIL).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "a");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldWarnMailEmpty() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_MAIL).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldGreetNewMail() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_MAIL).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "foufy@gmail.com");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }

    /* Test sur le password */

    @Test
    public void shouldWarnPasswordNotValid() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_PASSWORD).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "a");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldWarnPasswordEmpty() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_PASSWORD).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldGreetPassword() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CHECK_PASSWORD).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .post(ClientResponse.class, "azerty124");
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }
}
