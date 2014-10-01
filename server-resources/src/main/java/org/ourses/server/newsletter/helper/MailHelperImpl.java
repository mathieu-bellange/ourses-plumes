package org.ourses.server.newsletter.helper;

import java.io.IOException;
import java.util.Properties;
import java.util.regex.Pattern;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.util.EnvironnementVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.base.Strings;

@Component
public class MailHelperImpl implements MailHelper {

    Logger logger = LoggerFactory.getLogger(MailHelperImpl.class);

    private static final Pattern MAIL_PATTERN = Pattern
            .compile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    private static final String SHARING_SUBJECT_PREFIX = "Les Ourses à plumes : ";
    private static final String SHARING_BODY = "Quelqu'un vous a invité à lire <a href=\"http://{1}{2}\">{0}</a> sur <a href=\"http://{1}\">Les Ourses à plumes</a>. Bonne lecture !";

    @Override
    public boolean isMailValid(String mail) {
        return !Strings.isNullOrEmpty(mail) && MailHelperImpl.MAIL_PATTERN.matcher(mail).matches();
    }

    @Override
    public void shareArticle(String hostName, String mail, long id) {
        Article article = Article.findArticle(id);
        // build mail
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", "465");
        
        logger.info(" login " + EnvironnementVariable.SHARE_MAIL_ACCOUNT);
        logger.info("password" + EnvironnementVariable.SHARE_MAIL_PASSWORD);

        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(EnvironnementVariable.SHARE_MAIL_ACCOUNT,
                        EnvironnementVariable.SHARE_MAIL_PASSWORD);
            }
        });

        try {

            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(EnvironnementVariable.SHARE_MAIL_ACCOUNT));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(mail));
            message.setSubject(SHARING_SUBJECT_PREFIX.concat(article.getTitle()));
            message.setText(
                    SHARING_BODY.replace("{0}", article.getTitle()).replace("{1}", hostName).replace("{2}", article.getPath()), "utf-8", "html");
            logger.info("from " + message.getFrom()[0].toString());
            logger.info("to " + message.getRecipients(Message.RecipientType.TO)[0].toString());
            logger.info("content " + message.getContent().toString());
            Transport.send(message);
        }
        catch (MessagingException e) {
            logger.error("error sharing article by mail", e);
        }
        catch (IOException e) {
            logger.error("error sharing article by mail", e);
        }
    }
}
