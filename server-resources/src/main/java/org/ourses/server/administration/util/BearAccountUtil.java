package org.ourses.server.administration.util;

import java.util.regex.Pattern;

public final class BearAccountUtil {

    public static final Pattern passwordPattern = Pattern.compile("((?=.*\\d)(?=.*[a-z]).{7,20})");

    private BearAccountUtil() {

    }

}
