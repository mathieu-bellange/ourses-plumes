package org.ourses.server.administration.util;

import org.fest.assertions.Assertions;
import org.junit.Test;

public class SocialLinkUtilTest {
	
	
	
	@Test
	public void shouldCleanFacebookLink(){
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://facebook.com/user")).isEqualTo("user");
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://m.facebook.com/user")).isEqualTo("user");
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://m.facebook.com/user/blabla")).isEqualTo("user/blabla");
	}
	@Test
	public void shouldCleanTwitterLink(){
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://twitter.com/user")).isEqualTo("user");
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://mobile.twitter.com/user")).isEqualTo("user");
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://mobile.twitter.com/user/blabla")).isEqualTo("user/blabla");
	}
	@Test
	public void shouldCleanGooglePlusLink(){
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://plus.google.com/user")).isEqualTo("user");
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://plus.google.com/app/basic/user")).isEqualTo("user");
		Assertions.assertThat(SocialLinkUtil.cleanSocialLink("https://plus.google.com/app/basic/user/blabla")).isEqualTo("user/blabla");
	}

}
