package org.ourses.integration.picture;

import static org.fest.assertions.Assertions.assertThat;

import java.io.File;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.picture.domain.dto.AvatarDTO;

import com.sun.jersey.api.client.ClientResponse;

public class ITAvatarResources {

    private static final String PATH_GET_UNKNOWN_AVATAR = "/rest/avatars/666";
    private static final String PATH_PUT_AVATAR = "/rest/avatars/create";
    private static final String PATH_AFTER_PUT_AVATAR = "/rest/avatars/50";

    @Test
    public void shouldNotGetUnknownAvatar() {
        URI uri = UriBuilder.fromPath(PATH_GET_UNKNOWN_AVATAR).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldNotPutAvatarWithoutAuthc() {
        File imgFile = new File("src/test/resources/img/exemple.png");
        URI uri = UriBuilder.fromPath(PATH_PUT_AVATAR).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "image/*")
                .post(ClientResponse.class, imgFile);
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldPutAvatar() {
        File imgFile = new File("src/test/resources/img/exemple.png");
        URI uri = UriBuilder.fromPath(PATH_PUT_AVATAR).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAuthcToken(uri).header("Content-Type", "image/*")
                .post(ClientResponse.class, imgFile);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        AvatarDTO dto = clientResponse.getEntity(AvatarDTO.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(50l);
        assertThat(dto.getPath()).isEqualTo("/rest/avatars/50");
        uri = UriBuilder.fromPath(PATH_AFTER_PUT_AVATAR).build();
        clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
    }

    @Test
    public void shouldNotPutBigAvatar() {
        File imgFile = new File("src/test/resources/img/exemple2.jpg");
        URI uri = UriBuilder.fromPath(PATH_PUT_AVATAR).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAuthcToken(uri).header("Content-Type", "image/*")
                .post(ClientResponse.class, imgFile);
        assertThat(clientResponse.getStatus()).isEqualTo(500);
    }
}
