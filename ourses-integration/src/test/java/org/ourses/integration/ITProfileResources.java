package org.ourses.integration;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.administration.domain.dto.ProfileDTO;

import com.sun.jersey.api.client.ClientResponse;

public class ITProfileResources {

    private static final String PATH_GET_PROFILE = "/rest/profile/1";
    private static final String PATH_GET_UNKNOWN_PROFILE = "/rest/profile/666";

    @Test
    public void shouldGetProfile() {
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTO = clientResponse.getEntity(ProfileDTO.class);
        assertThat(profileDTO).isNotNull();
        assertThat(profileDTO.getDescription()).isNotNull();
        assertThat(profileDTO.getPseudo()).isNotNull();
        assertThat(profileDTO.getSocialLinks()).isNotEmpty();
        assertThat(profileDTO.getSocialLinks()).onProperty("network").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("socialUser").isNotNull();
    }

    @Test
    public void shouldSendErrorWithUnknownProfile() {
        URI uri = UriBuilder.fromPath(PATH_GET_UNKNOWN_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(500);
    }
}
