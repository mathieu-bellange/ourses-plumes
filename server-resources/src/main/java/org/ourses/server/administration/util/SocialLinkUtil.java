package org.ourses.server.administration.util;

import java.util.Comparator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.ourses.server.administration.domain.dto.SocialLinkDTO;
import org.ourses.server.administration.domain.entities.SocialLink;

import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

public final class SocialLinkUtil {

    public static final String TWITTER_REGEX = "https://www.twitter.com/";
    public static final String TWITTER_MOBILE_REGEX = "https://mobile.twitter.com/";
    public static final String FACEBOOK_REGEX = "https://www.facebook.com/";
    public static final String FACEBOOK_MOBILE_REGEX = "https://m.facebook.com/";
    public static final String GOOGLE_PLUS_REGEX = "https://plus.google.com/";
    public static final String GOOGLE_PLUS_MOBILE_REGEX = "https://plus.google.com/app/basic/";
    public static final String LINKED_IN_REGEX = "https://www.linkedin.com/";
    public static final Set<String> NETWORK = Sets.newHashSet("twitter", "facebook", "googleplus", "linkedin", "mail",
            "link");
    public static final Map<String, String> NETWORKS_MAP = buildNetworksMap();
    public static final Map<String, String> NETWORKS_DESC = buildNetworksDesc();
    public static final Map<String, Integer> NETWORKS_SORT = buildNetworksSort();
    public static final Comparator<SocialLinkDTO> NETWORK_COMPARATOR = new Comparator<SocialLinkDTO>() {

        @Override
        public int compare(SocialLinkDTO o1, SocialLinkDTO o2) {
            return NETWORKS_SORT.get(o1.getNetwork()).compareTo(NETWORKS_SORT.get(o2.getNetwork()));
        }
    };

    private SocialLinkUtil() {
    }

    private static Map<String, Integer> buildNetworksSort() {
        Map<String, Integer> map = Maps.newHashMap();
        map.put("twitter", 0);
        map.put("facebook", 1);
        map.put("googleplus", 2);
        map.put("linkedin", 3);
        map.put("mail", 4);
        map.put("link", 5);
        return map;
    }

    private static Map<String, String> buildNetworksMap() {
        Map<String, String> map = Maps.newHashMap();
        map.put("twitter", TWITTER_REGEX);
        map.put("facebook", FACEBOOK_REGEX);
        map.put("googleplus", GOOGLE_PLUS_REGEX);
        map.put("linkedin", LINKED_IN_REGEX);
        map.put("mail", "mailto:");
        map.put("link", "");
        return map;
    }

    private static Map<String, String> buildNetworksDesc() {
        Map<String, String> map = Maps.newHashMap();
        map.put("twitter", "profil Twitter");
        map.put("facebook", "page Facebook");
        map.put("googleplus", "compte Google+");
        map.put("linkedin", "compte LinkedIn");
        map.put("mail", "adresse email");
        map.put("link", "page perso");
        return map;
    }

    public static String cleanSocialLink(String socialLinkUrl) {
        return socialLinkUrl.replaceAll(FACEBOOK_REGEX, "").replaceAll(FACEBOOK_MOBILE_REGEX, "")
                .replaceAll(TWITTER_REGEX, "").replaceAll(TWITTER_MOBILE_REGEX, "")
                .replaceAll(GOOGLE_PLUS_MOBILE_REGEX, "").replaceAll(GOOGLE_PLUS_REGEX, "")
                .replaceAll(LINKED_IN_REGEX, "");
    }

    public static void buildDescription(SocialLink link) {
        for (Entry<String, String> network : SocialLinkUtil.NETWORKS_DESC.entrySet()) {
            if (network.getKey().equals(link.getNetwork())) {
                link.setDescription(network.getValue());
                break;
            }
        }
    }

    public static void buildPath(SocialLink link) {
        for (Entry<String, String> network : SocialLinkUtil.NETWORKS_MAP.entrySet()) {
            if (network.getKey().equals(link.getNetwork())) {
                link.setPath(network.getValue().concat(link.getSocialUser()));
                break;
            }
        }

    }

}
