package org.ourses.integration;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.util.Set;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.exception.AccountAuthcInfoNullException;
import org.ourses.server.domain.exception.AccountProfileNullException;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.ourses.server.domain.jsondto.administration.ProfileDTO;
import org.ourses.server.resources.util.HTTPUtility;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;

public class ITBearAccountResources {

    private static final String PATH_CREATE = "/rest/account/create";
    private static final String PATH_GET_ALL = "/rest/account";
    private static final String PATH_DELETE = "/rest/account/3";

    /* Account création */

    @Test
    public void shouldCreateAccount() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .put(ClientResponse.class, mapper.writeValueAsString(dummyAccount()));
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
        ClientResponse clientResponse = TestHelper
                .webResource(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "Julie", "mdp",
                                new ProfileDTO(null, null, 0), null, 0)));
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
        ClientResponse clientResponse = TestHelper
                .webResource(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, null, "mdp", new ProfileDTO("pseudo", null,
                                0), null, 0)));
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
        ClientResponse clientResponse = TestHelper
                .webResource(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "Julie", null, new ProfileDTO("pseudo",
                                null, 0), null, 0)));
        // status attendu 500
        assertThat(clientResponse.getStatus()).isEqualTo(500);
        assertThat(clientResponse.getHeaders().getFirst(HTTPUtility.HEADER_ERROR)).isEqualTo(
                AccountAuthcInfoNullException.class.getSimpleName());
    }

    /* List Account */

    @Test
    public void shouldSeeListAccounts() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_ALL).build();
        GenericType<Set<BearAccountDTO>> gt = new GenericType<Set<BearAccountDTO>>() {
        };
        Set<BearAccountDTO> list = TestHelper.webResource(uri).get(gt);
        assertThat(list).isNotEmpty();
        for (BearAccountDTO account : list) {
            assertThat(account.getId()).isNotNull();
            assertThat(account.getMail()).isNotNull();
            assertThat(account.getPassword()).isNull();
            assertThat(account.getProfile().getPseudo()).isNotNull();
            assertThat(account.getRole().getRole()).isNotNull();
        }
    }

    /* Delete account */

    @Test
    public void shouldDeleteAccount() {
        URI uri = UriBuilder.fromPath(PATH_DELETE).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).delete(ClientResponse.class);
        // status attendu 204
        assertThat(clientResponse.getStatus()).as("Verif que le status est no-content").isEqualTo(204);
    }

    private Object dummyAccount() {
        return new BearAccountDTO(null, "mail", "mdp", new ProfileDTO("pseudo", null, 0), null, 0);
    }

    /* TODO Patch du rôle par l'admin */

}
