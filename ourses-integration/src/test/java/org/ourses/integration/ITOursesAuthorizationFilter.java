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
import com.sun.jersey.api.client.WebResource.Builder;

public class ITOursesAuthorizationFilter {
	
	private static final String PATH_ROLES = "/rest/authz/roles";

	@Test
    public void shouldAccessAdminResources() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_ROLES).build();
        Builder clientResource = TestHelper.webResourceWithAdminRole(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
    }
	
	@Test
	public void shouldNotAccessAdminResources() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
	ClientHandlerException, IOException, InterruptedException {
		URI uri = UriBuilder.fromPath(PATH_ROLES).build();
		Builder clientResource = TestHelper.webResourceWithAuthcToken(uri);
		ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
				ClientResponse.class);
		assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
	}

}
