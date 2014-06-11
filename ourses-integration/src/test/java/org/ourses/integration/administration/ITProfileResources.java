package org.ourses.integration.administration;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;
import java.util.Set;

import javax.ws.rs.core.UriBuilder;

import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.dto.SocialLinkDTO;

import com.google.common.collect.Sets;
import com.sun.jersey.api.client.ClientResponse;

public class ITProfileResources {

    private static final String PATH_GET_PROFILE = "/rest/profile/1";
    private static final String PATH_GET_UNKNOWN_PROFILE = "/rest/profile/666";
    private static final String PATH_PUT_PROFILE = "/rest/profile/1";

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

    private Set<String> processSocialUsers(ProfileDTO profile) {
        Set<String> socialUsers = Sets.newHashSet();
        for (SocialLinkDTO link : profile.getSocialLinks()) {
            socialUsers.add(link.getSocialUser());
        }
        return socialUsers;
    }

    private Set<String> processSocialNetwork(ProfileDTO profile) {
        Set<String> socialUsers = Sets.newHashSet();
        for (SocialLinkDTO link : profile.getSocialLinks()) {
            socialUsers.add(link.getNetwork());
        }
        return socialUsers;
    }

    @Test
    public void shouldUpdatePseudo() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileBeforeUpdate = clientResponse.getEntity(ProfileDTO.class);
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO("pseudo", "monPseudo"));
        assertThat(clientResponse.getStatus()).isEqualTo(204);
        // get pseudo maj
        uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTOAfterUpdate = clientResponse.getEntity(ProfileDTO.class);
        assertThat(profileDTOAfterUpdate.getPseudo()).isEqualTo("monPseudo");
        assertThat(profileDTOAfterUpdate.getDescription()).isEqualTo(profileBeforeUpdate.getDescription());
        // social links n'ont pas changés
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("network").containsOnly(
                processSocialNetwork(profileBeforeUpdate).toArray());
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("socialUser").containsOnly(
                processSocialUsers(profileBeforeUpdate).toArray());
    }

    @Test
    public void shouldNotUpdatePseudoWithExistingPseudo() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO("pseudo", "jpetit"));
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldNotUpdatePseudoWithNullPseudo() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json").put(ClientResponse.class, new CoupleDTO("pseudo", ""));
        assertThat(clientResponse.getStatus()).isEqualTo(403);
    }

    @Test
    public void shouldUpdateDescription() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileBeforeUpdate = clientResponse.getEntity(ProfileDTO.class);
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO("description", "maDescription"));
        assertThat(clientResponse.getStatus()).isEqualTo(204);
        // get description maj
        uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTOAfterUpdate = clientResponse.getEntity(ProfileDTO.class);
        assertThat(profileDTOAfterUpdate.getPseudo()).isEqualTo(profileBeforeUpdate.getPseudo());
        assertThat(profileDTOAfterUpdate.getDescription()).isEqualTo("maDescription");
        // social links n'ont pas changés
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("network").containsOnly(
                processSocialNetwork(profileBeforeUpdate).toArray());
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("socialUser").containsOnly(
                processSocialUsers(profileBeforeUpdate).toArray());
    }

    @Test
    public void shouldAddSocialLink() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        // conserve le profil avant modification
        ProfileDTO profileBeforeUpdate = clientResponse.getEntity(ProfileDTO.class);
        // update, ajout d'un social link
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO("googleplus", "user_google_plus_1"));
        assertThat(clientResponse.getStatus()).isEqualTo(204);
        // get social link maj
        uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTOAfterUpdate = clientResponse.getEntity(ProfileDTO.class);
        // les properties du profil n'ont pas changés
        assertThat(profileDTOAfterUpdate.getPseudo()).isEqualTo(profileBeforeUpdate.getPseudo());
        assertThat(profileDTOAfterUpdate.getDescription()).isEqualTo(profileBeforeUpdate.getDescription());
        // un nouveau link
        assertThat(profileDTOAfterUpdate.getSocialLinks().size()).isEqualTo(
                profileBeforeUpdate.getSocialLinks().size() + 1);
        // vérifie les socials users en ajoutant le nouveau
        Set<String> socialUser = processSocialUsers(profileBeforeUpdate);
        socialUser.add("user_google_plus_1");
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("socialUser").containsOnly(socialUser.toArray());
    }

    @Test
    public void shouldUpdateSocialLink() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileBeforeUpdate = clientResponse.getEntity(ProfileDTO.class);
        SocialLinkDTO linkToUpdate = profileBeforeUpdate.getSocialLinks().iterator().next();
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO(linkToUpdate.getNetwork(), "update_social_user"));
        assertThat(clientResponse.getStatus()).isEqualTo(204);
        // get social link maj
        uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTOAfterUpdate = clientResponse.getEntity(ProfileDTO.class);
        // les properties du profil n'ont pas changés
        assertThat(profileDTOAfterUpdate.getPseudo()).isEqualTo(profileBeforeUpdate.getPseudo());
        assertThat(profileDTOAfterUpdate.getDescription()).isEqualTo(profileBeforeUpdate.getDescription());
        // le nombre de link est inchangé
        assertThat(profileDTOAfterUpdate.getSocialLinks().size())
                .isEqualTo(profileBeforeUpdate.getSocialLinks().size());
        // retire le social user mis à jour et ajoute le nouveau
        Set<String> socialUser = processSocialUsers(profileBeforeUpdate);
        socialUser.remove(linkToUpdate.getSocialUser());
        socialUser.add("update_social_user");
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("socialUser").contains(socialUser.toArray());
    }

    @Test
    public void shouldRemoveSocialLink() {
        // get profile before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileBeforeUpdate = clientResponse.getEntity(ProfileDTO.class);
        SocialLinkDTO linkToUpdate = profileBeforeUpdate.getSocialLinks().iterator().next();
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO(linkToUpdate.getNetwork(), ""));
        assertThat(clientResponse.getStatus()).isEqualTo(204);
        // get social link maj
        uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTOAfterUpdate = clientResponse.getEntity(ProfileDTO.class);
        // les properties du profil n'ont pas changés
        assertThat(profileDTOAfterUpdate.getPseudo()).isEqualTo(profileBeforeUpdate.getPseudo());
        assertThat(profileDTOAfterUpdate.getDescription()).isEqualTo(profileBeforeUpdate.getDescription());
        // le nombre de link est réduit de 1
        assertThat(profileDTOAfterUpdate.getSocialLinks().size()).isEqualTo(
                profileBeforeUpdate.getSocialLinks().size() - 1);
        // retire le social user mis à jour et ajoute le nouveau
        Set<String> socialUser = processSocialUsers(profileBeforeUpdate);
        socialUser.remove(linkToUpdate.getSocialUser());
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("socialUser").contains(socialUser.toArray());
    }
}
