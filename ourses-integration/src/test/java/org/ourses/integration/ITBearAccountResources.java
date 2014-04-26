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
import org.ourses.server.administration.domain.dto.BearAccountDTO;
import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.security.util.RolesUtil;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.UniformInterfaceException;

public class ITBearAccountResources {

    private static final String PATH_CREATE = "/rest/account/create";
    private static final String PATH_GET_ALL = "/rest/account";
    private static final String PATH_DELETE = "/rest/account/3";
    private static final String PATH_GET_ACCOUNT = "/rest/account/2";
    private static final String PATH_UPDATE_ROLE = "rest/account/3/role";
    private static final String PATH_GET_FALSE_ACCOUNT = "/rest/account/59";

    /* Account création */

    @Test
    public void shouldCreateAccount() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, mapper.writeValueAsString(dummyAccount()));
        // status attendu 201
        assertThat(clientResponse.getStatus()).as("Verif que le status est ok").isEqualTo(201);
        BearAccountDTO account = clientResponse.getEntity(BearAccountDTO.class);
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
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "Julie", "mdp",
                                new ProfileDTO(null, null, 0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotCreateAccountWithPseudoAlreadyTaken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "Julie", "mdp", new ProfileDTO("jpetit",
                                null, 0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotCreateAccountWithoutMail() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, null, "mdp", new ProfileDTO("pseudo", null,
                                0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotCreateAccountWithWrongMail() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "toto", "mdp", new ProfileDTO("pseudo",
                                null, 0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotCreateAccountWithMailAlreadyTaken() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "jpetit@gmail.com", "mdp", new ProfileDTO(
                                "pseudo", null, 0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotCreateAccountWithoutMdp() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "Julie", null, new ProfileDTO("pseudo",
                                null, 0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotCreateAccountWithWrongMdp() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_CREATE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new BearAccountDTO(null, "Julie", "aze", new ProfileDTO("pseudo",
                                null, 0), null, 0)));
        // status attendu 403
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    /* List Account */

    @Test
    public void shouldSeeListAccounts() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_GET_ALL).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<Set<BearAccountDTO>> gt = new GenericType<Set<BearAccountDTO>>() {
        };
        Set<BearAccountDTO> list = clientResponse.getEntity(gt);
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
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).delete(ClientResponse.class);
        // status attendu 204
        assertThat(clientResponse.getStatus()).as("Verif que le status est no-content").isEqualTo(204);
    }

    private Object dummyAccount() {
        return new BearAccountDTO(null, "mail@gmail.com", "mdp789654azerr", new ProfileDTO("pseudo", null, 0), null, 0);
    }

    /* TODO Patch du rôle par l'admin */

    @Test
    public void shouldGetAccount() {
        URI uri = UriBuilder.fromPath(PATH_GET_ACCOUNT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        BearAccountDTO bearAccountDTO = clientResponse.getEntity(BearAccountDTO.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        assertThat(bearAccountDTO).isNotNull();
        assertThat(bearAccountDTO.getId()).isEqualTo(2);
        assertThat(bearAccountDTO.getPassword()).isNull();

    }

    @Test
    public void shouldNotFindAccount() {
        URI uri = UriBuilder.fromPath(PATH_GET_FALSE_ACCOUNT).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(500);
    }

    @Test
    public void updateRoleAccount() throws JsonGenerationException, JsonMappingException, UniformInterfaceException,
            ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_UPDATE_ROLE).build();
        ObjectMapper mapper = new ObjectMapper();
        ClientResponse clientResponse = TestHelper
                .webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json")
                .put(ClientResponse.class,
                        mapper.writeValueAsString(new OursesAuthzInfoDTO(1L, RolesUtil.REDACTRICE)));
        // status attendu
        assertThat(clientResponse.getStatus()).isEqualTo(204);
        ClientResponse clientResponseGet = TestHelper.webResourceWithAdminRole(
                UriBuilder.fromPath(PATH_GET_ACCOUNT).build()).get(ClientResponse.class);
        BearAccountDTO bearAccountDTO = clientResponseGet.getEntity(BearAccountDTO.class);
        assertThat(bearAccountDTO.getRole().getRole()).isEqualTo(RolesUtil.REDACTRICE);
    }
}
