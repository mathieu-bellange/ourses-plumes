package org.ourses.integration.picture;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;

import com.sun.jersey.api.client.ClientResponse;

public class ITAvatarResources {

    private static final String PATH_GET_UNKNOWN_AVATAR = "/rest/avatars/666";

    @Test
    public void shouldNotGetUnknownAvatar() {
        URI uri = UriBuilder.fromPath(PATH_GET_UNKNOWN_AVATAR).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }
}
