package org.ourses.server.resources;

import static com.sun.jersey.api.client.ClientResponse.Status.OK;
import static com.sun.jersey.api.client.ClientResponse.Status.UNAUTHORIZED;
import static org.fest.assertions.Assertions.assertThat;
import static org.junit.Assert.assertEquals;

import org.junit.Rule;
import org.junit.Test;
import org.ourses.server.utility.EmbeddedServer;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;

public class SafeResourceTest {

    @Rule
    public EmbeddedServer server = new EmbeddedServer();

    @Test
    public void authentication_should_failed_without_credential() {
        assertThat(resource().getStatus()).isEqualTo(UNAUTHORIZED.getStatusCode());
    }

    @Test
    public void authentication_should_succeed_with_credential_and_permission() {
        ClientResponse response = resource("pierre", "trev");
        assertThat(response.getStatus()).isEqualTo(OK.getStatusCode());
        assertEquals("authorized", response.getEntity(String.class));
    }

    @Test
    public void authozisation_should_failed_without_permission() {
        assertThat(resource("paul", "uelb").getStatus()).isEqualTo(UNAUTHORIZED.getStatusCode());
    }

    private ClientResponse resource() {
        return Client.create().resource(server.uri() + "/rest/safe").get(ClientResponse.class);
    }

    private ClientResponse resource(String user, String pass) {
        WebResource resource = Client.create().resource(server.uri() + "/rest/safe");
        resource.addFilter(new HTTPBasicAuthFilter(user, pass));
        return resource.get(ClientResponse.class);
    }
}
