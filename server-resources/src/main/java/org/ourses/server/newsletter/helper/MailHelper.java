package org.ourses.server.newsletter.helper;

public interface MailHelper {

    boolean isMailValid(String mail);

    void shareArticle(String hostName, String mail, long id);

	void renewPassword(String renewUrl, String mail);
}
