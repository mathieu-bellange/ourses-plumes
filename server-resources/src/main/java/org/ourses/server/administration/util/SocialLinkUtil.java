package org.ourses.server.administration.util;

import java.util.Set;

import com.google.common.collect.Sets;

public final class SocialLinkUtil {

    public static final String TWITTER_REGEX = "https://twitter.com/";
    public static final String TWITTER_MOBILE_REGEX = "https://mobile.twitter.com/";
    public static final String FACEBOOK_REGEX = "https://facebook.com/";
    public static final String FACEBOOK_MOBILE_REGEX = "https://m.facebook.com/";
    public static final String GOOGLE_PLUS_REGEX = "https://plus.google.com/";
    public static final String GOOGLE_PLUS_MOBILE_REGEX = "https://plus.google.com/app/basic/";
    public static final Set<String> NETWORK = Sets.newHashSet("twitter", "facebook", "googleplus", "linkedin", "mail",
            "home", "link");

    private SocialLinkUtil() {

    }

    public static String cleanSocialLink(String socialLinkUrl) {
        return socialLinkUrl.replaceAll(FACEBOOK_REGEX, "").replaceAll(FACEBOOK_MOBILE_REGEX, "")
                .replaceAll(TWITTER_REGEX, "").replaceAll(TWITTER_MOBILE_REGEX, "")
                .replaceAll(GOOGLE_PLUS_MOBILE_REGEX, "").replaceAll(GOOGLE_PLUS_REGEX, "");
    }

}
