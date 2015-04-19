package org.ourses.server.util;

public final class EnvironnementVariable {

    public static final String SHARE_MAIL_ACCOUNT = System.getenv("SHARE_MAIL_ACCOUNT");
    public static final String SHARE_MAIL_PASSWORD = System.getenv("SHARE_MAIL_PASSWORD");
    public static final String SHA_SALT = System.getenv("SHA_SALT");
    public static final String DOMAIN_NAME = System.getenv("DOMAIN_NAME");
    
    public static final String BITLY_ACCESS_TOKEN = System.getenv("BITLY_ACCESS_TOKEN");
    
    

    private EnvironnementVariable() {

    }

}
