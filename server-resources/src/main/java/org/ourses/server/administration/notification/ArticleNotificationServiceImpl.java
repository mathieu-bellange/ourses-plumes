package org.ourses.server.administration.notification;

import java.util.Collection;
import java.util.Set;

import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.newsletter.helper.MailHelper;
import org.ourses.server.redaction.domain.entities.Article;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;

@Service
@EnableScheduling
public class ArticleNotificationServiceImpl implements ArticleNotificationService {

    Logger logger = LoggerFactory.getLogger(ArticleNotificationServiceImpl.class);
    @Autowired
    MailHelper mailHelper;

    @Override
    @Scheduled(cron = "0 0 12 * * ?")
    public void sendValidatedArticleToAdmin() {
        logger.debug("send notification to admin with article to publish");
        Set<BearAccount> adminAccounts = BearAccount.findAdminAccounts();
        logger.debug("Admin accounts : {}", adminAccounts);
        Set<Article> articleToPublish = Article.findToCheck();
        logger.debug("Article to publish : {}", articleToPublish);
        Collection<String> mails = Collections2.transform(adminAccounts, new Function<BearAccount, String>() {

			@Override
			public String apply(BearAccount arg0) {
				return arg0.getAuthcInfo().getMail();
			}
		});
        mailHelper.sendNotification(mails, articleToPublish);
    }
}
