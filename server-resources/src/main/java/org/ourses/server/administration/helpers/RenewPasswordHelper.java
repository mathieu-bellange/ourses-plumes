package org.ourses.server.administration.helpers;


public interface RenewPasswordHelper {

    String generateUrlToRenewPassword(String mail, String expiredDate);

	boolean isRenewPasswordIdMatch(String id, String mail, String date);

}
