package org.ourses.server.resources;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.util.Set;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.jaxrs.JacksonJsonProvider;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Ignore;
import org.junit.Rule;
import org.junit.Test;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.ourses.server.domain.jsondto.administration.ProfileDTO;
import org.ourses.server.utility.EmbeddedServer;

import com.google.common.collect.Sets;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;

public class BearAccountResourcesTest {

    @Rule
    public EmbeddedServer server = new EmbeddedServer();

    @Test
    public void shouldCreateNewAccount() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        authenticate();
        URI uri = UriBuilder.fromPath("/rest/account").build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = webResource(uri).header("Content-Type", "application/json").post(
                ClientResponse.class, mapper.writeValueAsString(dummyAccount()));
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(200);
    }

    @Test
    @Ignore
    public void shouldSeeListAccounts() {
        URI uri = UriBuilder.fromPath("/rest/account").build();
        GenericType<Set<BearAccountDTO>> gt = new GenericType<Set<BearAccountDTO>>() {
        };
        Set<BearAccountDTO> list = webResource(uri).header("Content-Type", "application/json").get(gt);
        assertThat(list).isNotEmpty();
    }

    private WebResource authenticate() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath("/login.html").build();
        WebResource webResource = webResource(uri);
        webResource.header("Content-Type", "application/x-www-form-urlencoded").post(
                "username=mbellange@gmail.com&password=Bellange&rememberMe=True&Login=Login");
        return webResource;
    }

    private Object dummyAccount() {
        return new BearAccountDTO("login", "mdp", Sets.newHashSet("1"), new ProfileDTO("pseudo", "description"));
    }

    /* helpers */
    private WebResource webResource(URI uri) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        WebResource webResource = Client.create(cc).resource(server.uri()).path(uri.getPath());
        webResource.addFilter(new HTTPBasicAuthFilter("", ""));
        webResource.accept(MediaType.APPLICATION_JSON_TYPE);
        return webResource;
    }

}
