package org.ourses.server.administration.helpers;

import static org.fest.assertions.Assertions.assertThat;

import java.util.HashSet;

import org.junit.Test;
import org.ourses.server.administration.domain.dto.CoupleDTO;
import org.ourses.server.administration.domain.entities.Profile;
import org.ourses.server.administration.domain.entities.SocialLink;

import com.google.common.collect.Sets;

public class ProfileHelperTest {

    private final ProfileHelper helper = new ProfileHelperImpl();

    @Test
    public void shouldUpdatePseudoProperty() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(new HashSet<SocialLink>());
        CoupleDTO couplePseudo = new CoupleDTO("pseudo", "newPseudo");
        // verify
        assertThat(helper.updateProfileProperty(profile, couplePseudo)).isTrue();
        assertThat(profile.getPseudo()).isEqualTo("newPseudo");
        assertThat(profile.getDescription()).isEqualTo("oldDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks()).isEmpty();
    }

    @Test
    public void shouldUpdateDescriptionProperty() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(new HashSet<SocialLink>());
        CoupleDTO coupleDescription = new CoupleDTO("description", "newDescription");
        // verify
        assertThat(helper.updateProfileProperty(profile, coupleDescription)).isTrue();
        assertThat(profile.getPseudo()).isEqualTo("oldPseudo");
        assertThat(profile.getDescription()).isEqualTo("newDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks()).isEmpty();
    }

    @Test
    public void shouldNotUpdateIdProperty() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(new HashSet<SocialLink>());
        CoupleDTO coupleDescription = new CoupleDTO("id", "2");
        // verify
        assertThat(helper.updateProfileProperty(profile, coupleDescription)).isFalse();
        assertThat(profile.getPseudo()).isEqualTo("oldPseudo");
        assertThat(profile.getDescription()).isEqualTo("oldDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks()).isEmpty();
    }

    @Test
    public void shouldCopySocialLinkProperty() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(new HashSet<SocialLink>());
        CoupleDTO coupleTwitter = new CoupleDTO("twitter", "user_twitter");
        // verify
        assertThat(helper.updateProfileProperty(profile, coupleTwitter)).isTrue();
        assertThat(profile.getPseudo()).isEqualTo("oldPseudo");
        assertThat(profile.getDescription()).isEqualTo("oldDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks()).isNotEmpty();
        assertThat(profile.getSocialLinks()).onProperty("network").containsOnly("twitter");
    }

    @Test
    public void shouldUpdateSocialLinkProperty() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(Sets.newHashSet(new SocialLink(1l, "twitter", "old_user_twitter")));
        CoupleDTO coupleTwitter = new CoupleDTO("twitter", "new_user_twitter");
        // verify
        assertThat(helper.updateProfileProperty(profile, coupleTwitter)).isTrue();
        assertThat(profile.getPseudo()).isEqualTo("oldPseudo");
        assertThat(profile.getDescription()).isEqualTo("oldDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks().size()).isEqualTo(1);
        assertThat(profile.getSocialLinks()).onProperty("socialUser").containsOnly("new_user_twitter");
    }

    @Test
    public void shouldNotUpdateAnUnknownSocialNetwork() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(Sets.newHashSet(new SocialLink(1l, "twitter", "old_user_twitter")));
        CoupleDTO coupleTwitter = new CoupleDTO("autre_chose", "new_user_autre_chose");
        // verify
        assertThat(helper.updateProfileProperty(profile, coupleTwitter)).isFalse();
        assertThat(profile.getPseudo()).isEqualTo("oldPseudo");
        assertThat(profile.getDescription()).isEqualTo("oldDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks().size()).isEqualTo(1);
        assertThat(profile.getSocialLinks()).onProperty("socialUser").containsOnly("old_user_twitter");
    }

    @Test
    public void shouldRemoveSocialNetworkWithEmptyValue() {
        // prepare
        Profile profile = new Profile(1l, "oldPseudo", "oldDescription");
        profile.setSocialLinks(Sets.newHashSet(new SocialLink(1l, "twitter", "old_user_twitter")));
        CoupleDTO coupleTwitter = new CoupleDTO("twitter", "");
        // verify
        assertThat(helper.updateProfileProperty(profile, coupleTwitter)).isTrue();
        assertThat(profile.getPseudo()).isEqualTo("oldPseudo");
        assertThat(profile.getDescription()).isEqualTo("oldDescription");
        assertThat(profile.getId()).isEqualTo(1l);
        assertThat(profile.getSocialLinks()).isEmpty();
    }
}
