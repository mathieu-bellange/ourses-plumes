package org.ourses.server.administration.notification;

import java.util.Set;

import org.ourses.server.administration.domain.entities.BearAccount;
import org.ourses.server.redaction.domain.entities.Article;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
public class ArticleNotificationServiceImpl implements ArticleNotificationService {

    Logger logger = LoggerFactory.getLogger(ArticleNotificationServiceImpl.class);

    @Override
    @Scheduled(cron = "0 0 12 * * ?")
    public void sendValidatedArticleToAdmin() {
        logger.debug("send notification to admin with article to publish");
        Set<BearAccount> adminAccounts = BearAccount.findAdminAccounts();
        logger.debug("Admin accounts : {}", adminAccounts);
        Set<Article> articleToPublish = Article.findToCheck();
        logger.debug("Article to publish : {}", articleToPublish);
    }
}
