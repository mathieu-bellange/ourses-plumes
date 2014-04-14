package org.ourses.server.security.util;

import org.apache.shiro.codec.Base64;

public final class SecurityUtil {

    private SecurityUtil() {

    }

    public static String extractBasicAuthorization(String basicEncode) {
        return basicEncode.replace("Basic ", "");
    }

    public static String[] decodeBasicAuthorization(String basicEncode) {
        return Base64.decodeToString(extractBasicAuthorization(basicEncode)).split(":", 2);
    }

}
