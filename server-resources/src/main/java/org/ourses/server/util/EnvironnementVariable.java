package org.ourses.server.util;

public final class EnvironnementVariable {

    public static final String SHARE_MAIL_ACCOUNT = System.getenv("SHARE_MAIL_ACCOUNT");
    public static final String SHARE_MAIL_PASSWORD = System.getenv("SHARE_MAIL_PASSWORD");

    private EnvironnementVariable() {

    }

}
