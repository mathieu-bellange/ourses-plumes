package org.ourses.server.external;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Ignore;
import org.junit.Test;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;

public class GithubTest {

    private final GithubRequest request = new GithubRequest();

    @Test
    @Ignore
    public void shouldCreateIssue() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        GithubBug bug = new GithubBug("le titre","le corps");
        ClientResponse clientResponse = request.addIssue(bug);
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(201);
    }
}
