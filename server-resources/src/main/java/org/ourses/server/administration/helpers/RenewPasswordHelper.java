package org.ourses.server.administration.helpers;


public interface RenewPasswordHelper {

    String generateUrlToRenewPassword(String host, String mail, String expiredDate);

}
