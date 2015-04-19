package org.ourses.server.newsletter.helper;

import java.util.Collection;
import java.util.Set;

import org.ourses.server.redaction.domain.entities.Article;

public interface MailHelper {

    boolean isMailValid(String mail);
    
    void sendNotification(Collection<String> mails, Set<Article> articles);

    void shareArticle(String hostName, String mail, long id);

	void renewPassword(String renewUrl, String mail);
}
