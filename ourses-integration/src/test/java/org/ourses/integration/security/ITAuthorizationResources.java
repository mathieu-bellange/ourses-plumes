package org.ourses.integration.security;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.util.Set;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.security.util.RolesUtil;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.ClientResponse.Status;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.WebResource.Builder;

public class ITAuthorizationResources {

    private static final String PATH_ROLES = "/rest/authz/roles";
    private static final String PATH_AUTHZ_ISADMIN = "/rest/authz/isadmin";
    private static final String PATH_AUTHZ_ISREDAC = "/rest/authz/isredac";

    @Test
    public void shouldAccessAdminResources() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_AUTHZ_ISADMIN).build();
        Builder clientResource = TestHelper.webResourceWithAdminRole(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }

    @Test
    public void shouldNotAccessAdminResources() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_AUTHZ_ISADMIN).build();
        Builder clientResource = TestHelper.webResourceWithRedacRole(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.FORBIDDEN.getStatusCode());
    }

    @Test
    public void shouldAccessRedacResources() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_AUTHZ_ISREDAC).build();
        Builder clientResource = TestHelper.webResourceWithRedacRole(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.NO_CONTENT.getStatusCode());
    }

    @Test
    public void shouldNotAccessRedacResources() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_AUTHZ_ISREDAC).build();
        WebResource clientResource = TestHelper.webResource(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(Status.UNAUTHORIZED.getStatusCode());
    }

    @Test
    public void shouldGetAllRoles() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException, InterruptedException {
        URI uri = UriBuilder.fromPath(PATH_ROLES).build();
        Builder clientResource = TestHelper.webResourceWithAdminRole(uri);
        ClientResponse clientResponse = clientResource.header("Content-Type", "application/json").get(
                ClientResponse.class);
        GenericType<Set<OursesAuthzInfoDTO>> gt = new GenericType<Set<OursesAuthzInfoDTO>>() {
        };
        assertThat(clientResponse.getStatus()).isEqualTo(Status.OK.getStatusCode());
        assertThat(clientResponse.getEntity(gt)).onProperty("role").containsOnly(RolesUtil.ADMINISTRATRICE,
                RolesUtil.REDACTRICE);
    }

}
