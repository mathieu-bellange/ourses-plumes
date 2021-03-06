package org.ourses.server.external;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Ignore;
import org.junit.Test;
import org.ourses.server.external.domain.dto.GithubBug;

import com.sun.jersey.api.client.ClientResponse;

public class GithubTest {

    private final GithubRequest request = new GithubRequest();

    @Test
    @Ignore
    public void shouldCreateIssue() {
        GithubBug bug = new GithubBug("le titre","le corps");
        ClientResponse clientResponse = request.addIssue(bug);
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(201);
    }
}
