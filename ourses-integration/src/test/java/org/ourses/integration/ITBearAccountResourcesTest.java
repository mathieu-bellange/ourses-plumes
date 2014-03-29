package org.ourses.integration;

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
import org.junit.Test;
import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.domain.exception.AccountProfileNullException;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.ourses.server.domain.jsondto.administration.ProfileDTO;
import org.ourses.server.resources.util.HTTPUtility;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class ITBearAccountResourcesTest {
	
	private static final String PATH_CREATE = "/rest/account/create";

    @Test
    public void shouldCreateAccount() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = webResource(uri).header("Content-Type", "application/json").put(
                ClientResponse.class, mapper.writeValueAsString(dummyAccount()));
        // status attendu 201
        BearAccountDTO account = clientResponse.getEntity(BearAccountDTO.class);
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(201);
        // id non null, password null, profil non null et role à Rédactrice
        assertThat(account.getId()).isNotNull();
        assertThat(account.getPassword()).isNull();
        assertThat(account.getProfile()).isNotNull();
        assertThat(account.getRole()).isNotNull();
        assertThat(account.getRole().getRole()).isEqualTo(RolesUtil.REDACTRICE);
    }

    @Test
    public void shouldNotCreateAccountWithoutPseudo() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = webResource(uri).header("Content-Type", "application/json").put(
                ClientResponse.class,
                mapper.writeValueAsString(new BearAccountDTO(null, "Julie", "mdp", new ProfileDTO(null, null, 0), null,
                        0)));
        // status attendu 500
        assertThat(clientResponse.getStatus()).isEqualTo(500);
        assertThat(clientResponse.getHeaders().getFirst(HTTPUtility.HEADER_ERROR)).isEqualTo(
                AccountProfileNullException.class.getSimpleName());
    }

    @Test
    public void shouldNotCreateAccountWithoutMail() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = webResource(uri).header("Content-Type", "application/json").put(
                ClientResponse.class,
                mapper.writeValueAsString(new BearAccountDTO(null, null, "mdp", new ProfileDTO("pseudo", null, 0),
                        null, 0)));
        // status attendu 500
        assertThat(clientResponse.getStatus()).isEqualTo(500);
        assertThat(clientResponse.getHeaders().getFirst(HTTPUtility.HEADER_ERROR)).isEqualTo(
                AccountAuthcInfoNullException.class.getSimpleName());
    }

    @Test
    public void shouldNotCreateAccountWithoutMdp() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = webResource(uri).header("Content-Type", "application/json").put(
                ClientResponse.class,
                mapper.writeValueAsString(new BearAccountDTO(null, "Julie", null, new ProfileDTO("pseudo", null, 0),
                        null, 0)));
        // status attendu 500
        assertThat(clientResponse.getStatus()).isEqualTo(500);
        assertThat(clientResponse.getHeaders().getFirst(HTTPUtility.HEADER_ERROR)).isEqualTo(
                AccountAuthcInfoNullException.class.getSimpleName());
    }

    @Test
    public void shouldSeeListAccounts() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath("/rest/account").build();
        GenericType<Set<BearAccountDTO>> gt = new GenericType<Set<BearAccountDTO>>() {
        };
        Set<BearAccountDTO> list = webResource(uri).get(gt);
        assertThat(list).isNotEmpty();
        for (BearAccountDTO account : list) {
            assertThat(account.getId()).isNotNull();
            assertThat(account.getMail()).isNotNull();
            assertThat(account.getPassword()).isNull();
            assertThat(account.getProfile().getPseudo()).isNotNull();
            assertThat(account.getRole().getRole()).isNotNull();
        }
    }

    private Object dummyAccount() {
        return new BearAccountDTO(null, "mail", "mdp", new ProfileDTO("pseudo", null, 0), null, 0);
    }

    /* helpers */
    private WebResource webResource(URI uri) {
        ClientConfig cc = new DefaultClientConfig(JacksonJsonProvider.class);
        WebResource webResource = Client.create(cc).resource("http://localhost:8080").path(uri.getPath());
        webResource.type(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON);
        return webResource;
    }

}
