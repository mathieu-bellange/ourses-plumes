package org.ourses.server.administration.domain.entities;

import static org.fest.assertions.Assertions.assertThat;

import org.junit.Test;
import org.ourses.server.administration.domain.dto.ProfileDTO;

import com.google.common.collect.Sets;

public class ProfileTest {

    @Test
    public void shouldCopyProfileIntoProfileDTO() {
        // prepare
        Profile profile = new Profile(1l, "pseudo", "desc");
        SocialLink link1 = new SocialLink(1l, "network1", "social_user1");
        SocialLink link2 = new SocialLink(2l, "network2", "social_user2");
        profile.setSocialLinks(Sets.newHashSet(link1, link2));
        // verify
        ProfileDTO profileDTO = profile.toProfileDTO();
        assertThat(profileDTO.getPseudo()).isEqualTo(profile.getPseudo());
        assertThat(profileDTO.getDescription()).isEqualTo(profile.getDescription());
        assertThat(profileDTO.getSocialLinks().size()).isEqualTo(profile.getSocialLinks().size());
        assertThat(profileDTO.getSocialLinks()).onProperty("network").containsOnly(link1.getNetwork(),
                link2.getNetwork());
        assertThat(profileDTO.getSocialLinks()).onProperty("socialUser").containsOnly(link1.getSocialUser(),
                link2.getSocialUser());
    }

    @Test
    public void shouldCopyProfileIntoProfileDTOWithoutSocialLinks() {
        // prepare
        Profile profile = new Profile(1l, "pseudo", "desc");
        profile.setSocialLinks(null);
        // verify
        ProfileDTO profileDTO = profile.toProfileDTO();
        assertThat(profileDTO.getPseudo()).isEqualTo(profile.getPseudo());
        assertThat(profileDTO.getDescription()).isEqualTo(profile.getDescription());
        assertThat(profileDTO.getSocialLinks()).isEmpty();
    }
}
