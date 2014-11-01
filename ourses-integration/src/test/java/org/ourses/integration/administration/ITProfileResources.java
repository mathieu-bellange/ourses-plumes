package org.ourses.integration.administration;

import static org.fest.assertions.Assertions.assertThat;

import java.net.URI;
import java.util.List;
import java.util.Set;

import javax.ws.rs.core.UriBuilder;

import org.fest.assertions.Condition;
import org.joda.time.DateTime;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.dto.ProfileDTO;
import org.ourses.server.administration.domain.dto.SocialLinkDTO;
import org.ourses.server.redaction.domain.dto.ArticleDTO;

import com.google.common.collect.Sets;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;

public class ITProfileResources {

    private static final String PATH_GET_PROFILE = "/rest/profile/1";
    private static final String PATH_GET_UNKNOWN_PROFILE = "/rest/profile/666";
    private static final String PATH_PUT_PROFILE = "/rest/profile/1";
    private static final String PATH_GET_PROFILE_PSEUDO = "/rest/profile/mbellange";
    private static final String PATH_GET_UNKNOWN_PROFILE_PSEUDO = "/rest/profile/toto";
    private static final String PATH_GET_PROFILE_ROLE = "/rest/profile/mbellange/authz";
    private static final String PATH_GET_NOT_FOUND_ROLE = "/rest/profile/toto/authz";
    private static final String PATH_GET_PROFILE_ARTICLES = "/rest/profile/2/articles";

    @Test
    public void shouldGetRoleProfile() {
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE_ROLE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        String role = clientResponse.getEntity(String.class);
        assertThat(role).isEqualTo("Administratrice");
    }

    @Test
    public void shouldNotFoundRoleProfile() {
        URI uri = UriBuilder.fromPath(PATH_GET_NOT_FOUND_ROLE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldGetProfileById() {
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTO = clientResponse.getEntity(ProfileDTO.class);
        assertThat(profileDTO).isNotNull();
        assertThat(profileDTO.getDescription()).isNotNull();
        assertThat(profileDTO.getPseudo()).isNotNull();
        assertThat(profileDTO.getPath()).isNotNull();
        assertThat(profileDTO.getPseudoBeautify()).isNotNull();
        assertThat(profileDTO.getAvatar()).isNotNull();
        assertThat(profileDTO.getAvatar().getPath()).isNotNull();
        assertThat(profileDTO.getSocialLinks()).isNotEmpty();
        assertThat(profileDTO.getSocialLinks()).onProperty("network").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("socialUser").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("path").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("description").isNotNull();
    }

    @Test
    public void shouldGetProfileByPseudoBeautify() {
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE_PSEUDO).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ProfileDTO profileDTO = clientResponse.getEntity(ProfileDTO.class);
        assertThat(profileDTO).isNotNull();
        assertThat(profileDTO.getDescription()).isNotNull();
        assertThat(profileDTO.getPseudo()).isNotNull();
        assertThat(profileDTO.getPath()).isNotNull();
        assertThat(profileDTO.getPseudoBeautify()).isNotNull();
        assertThat(profileDTO.getSocialLinks()).isNotEmpty();
        assertThat(profileDTO.getSocialLinks()).onProperty("network").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("socialUser").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("path").isNotNull();
        assertThat(profileDTO.getSocialLinks()).onProperty("description").isNotNull();
    }

    @Test
    public void shouldSendErrorWithUnknownProfileById() {
        URI uri = UriBuilder.fromPath(PATH_GET_UNKNOWN_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(404);
    }

    @Test
    public void shouldSendErrorWithUnknownProfileByPseudo() {
        URI uri = UriBuilder.fromPath(PATH_GET_UNKNOWN_PROFILE_PSEUDO).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(404);
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
        assertThat(profileDTOAfterUpdate.getPath()).isEqualTo("/profils/monpseudo");
        assertThat(profileDTOAfterUpdate.getPseudoBeautify()).isEqualTo("monpseudo");
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
    public void shouldNotUpdatePseudoWithExistingPseudoBis() {
        // get pseudo before maj
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE).build();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        // update
        uri = UriBuilder.fromPath(PATH_PUT_PROFILE).build();
        clientResponse = TestHelper.webResourceWithAuthcToken(uri, "profile_to_update")
                .header("Content-Type", "application/json")
                .put(ClientResponse.class, new CoupleDTO("pseudo", "JPETIT !"));
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
        assertThat(profileDTOAfterUpdate.getPath()).isEqualTo(profileBeforeUpdate.getPath());
        assertThat(profileDTOAfterUpdate.getPseudoBeautify()).isEqualTo(profileBeforeUpdate.getPseudoBeautify());
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
        assertThat(profileDTOAfterUpdate.getPath()).isEqualTo(profileBeforeUpdate.getPath());
        assertThat(profileDTOAfterUpdate.getPseudoBeautify()).isEqualTo(profileBeforeUpdate.getPseudoBeautify());
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
        assertThat(profileDTOAfterUpdate.getPath()).isEqualTo(profileBeforeUpdate.getPath());
        assertThat(profileDTOAfterUpdate.getPseudoBeautify()).isEqualTo(profileBeforeUpdate.getPseudoBeautify());
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
        assertThat(profileDTOAfterUpdate.getPath()).isEqualTo(profileBeforeUpdate.getPath());
        assertThat(profileDTOAfterUpdate.getPseudoBeautify()).isEqualTo(profileBeforeUpdate.getPseudoBeautify());
        assertThat(profileDTOAfterUpdate.getDescription()).isEqualTo(profileBeforeUpdate.getDescription());
        // le nombre de link est réduit de 1
        assertThat(profileDTOAfterUpdate.getSocialLinks().size()).isEqualTo(
                profileBeforeUpdate.getSocialLinks().size() - 1);
        // retire le social user mis à jour et ajoute le nouveau
        Set<String> socialUser = processSocialUsers(profileBeforeUpdate);
        socialUser.remove(linkToUpdate.getSocialUser());
        assertThat(profileDTOAfterUpdate.getSocialLinks()).onProperty("socialUser").contains(socialUser.toArray());
    }

    @Test
    public void shouldGetProfileArticles() {
        // get profile articles
        URI uri = UriBuilder.fromPath(PATH_GET_PROFILE_ARTICLES).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).get(ClientResponse.class);
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        GenericType<List<ArticleDTO>> gt = new GenericType<List<ArticleDTO>>() {
        };
        List<ArticleDTO> articles = clientResponse.getEntity(gt);
        assertThat(articles).onProperty("publishedDate").satisfies(new Condition<List<?>>() {

            @Override
            public boolean matches(List<?> value) {
                boolean isOk = true;
                for (Object date : value) {
                    if (new DateTime(date).isAfterNow()) {
                        isOk = false;
                        break;
                    }
                }
                return isOk;
            }
        });
        assertThat(articles).onProperty("profile.id").containsOnly(2l);
        assertThat(articles).onProperty("rubrique.rubrique").containsOnly("International","Luttes");
    }
}
