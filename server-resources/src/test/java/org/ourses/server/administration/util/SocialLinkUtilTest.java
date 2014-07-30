package org.ourses.server.administration.util;

import static org.fest.assertions.Assertions.assertThat;

import org.fest.assertions.Assertions;
import org.junit.Test;
import org.ourses.server.administration.domain.entities.SocialLink;

public class SocialLinkUtilTest {

    @Test
    public void shouldCleanFacebookLink() {
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://www.facebook.com/user")).isEqualTo("user");
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://m.facebook.com/user")).isEqualTo("user");
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://m.facebook.com/user/blabla")).isEqualTo(
                "user/blabla");
    }

    @Test
    public void shouldCleanTwitterLink() {
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://www.twitter.com/user")).isEqualTo("user");
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://mobile.twitter.com/user")).isEqualTo("user");
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://mobile.twitter.com/user/blabla")).isEqualTo(
                "user/blabla");
    }

    @Test
    public void shouldCleanGooglePlusLink() {
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://plus.google.com/user")).isEqualTo("user");
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://plus.google.com/app/basic/user")).isEqualTo(
                "user");
        Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://plus.google.com/app/basic/user/blabla"))
                .isEqualTo("user/blabla");
    }

    @Test
    public void shouldBuildPathSocialLink() {
        SocialLink link = new SocialLink(1l, "twitter", "my_twitter");
        SocialLinkUtil.buildPath(link);
        assertThat(link.getPath()).isEqualTo("https://www.twitter.com/my_twitter");
    }

    @Test
    public void shouldBuildDescriptionSocialLink() {
        SocialLink link = new SocialLink(1l, "twitter", "my_twitter");
        SocialLinkUtil.buildDescription(link);
        assertThat(link.getDescription()).isEqualTo("profil Twitter");
    }

}
