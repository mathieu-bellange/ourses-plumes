package org.ourses.server.external;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.security.github.GithubInfoApi;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.representation.Form;

public class GithubTest {

    private final GithubRequest request = new GithubRequest();

    @Test
    public void shouldCreateIssue() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        Form formulaire = new Form();
        formulaire.add(GithubInfoApi.TITLE, "le titre");
        formulaire.add(GithubInfoApi.BODY, "le corps");
        ClientResponse clientResponse = request.addIssue(GithubInfoApi.BUG_TRACKING_URI, formulaire);
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(201);
    }
}
