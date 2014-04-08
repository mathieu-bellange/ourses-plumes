package org.ourses.server.authentication.util;

import java.util.regex.Pattern;

public final class BearAccountUtil {

    public static final Pattern mailPattern = Pattern
            .compile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    public static final Pattern passwordPattern = Pattern.compile("((?=.*\\d)(?=.*[a-z]).{7,20})");

    private BearAccountUtil() {

    }

}
