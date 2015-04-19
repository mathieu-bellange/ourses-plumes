package org.ourses.server.newsletter.helper;

import java.util.Collection;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Pattern;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang3.text.StrBuilder;
import org.ourses.server.redaction.domain.entities.Article;
import org.ourses.server.util.EnvironnementVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.base.Predicate;
import com.google.common.base.Strings;
import com.google.common.collect.Collections2;

@Component
public class MailHelperImpl implements MailHelper {

    Logger logger = LoggerFactory.getLogger(MailHelperImpl.class);

    private static final Pattern MAIL_PATTERN = Pattern
            .compile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    private static final String SHARING_SUBJECT_PREFIX = "Les Ourses à plumes : ";
    private static final String SHARING_BODY = "Quelqu'un vous a invité à lire <a href=\"http://{1}{2}\">{0}</a> sur <a href=\"http://{1}\">Les Ourses à plumes</a>. Bonne lecture !";
    
    private static final String RENEW_SUBJECT = "Renouvellement de votre mot de passe sur les Ourses à plumes";
    private static final String RENEW_BODY = "Vous avez demandé à renouveller votre mot de passe sur les Ourses à plumes, pour le faire cliquez ici: <a href=\"{0}\">{0}</a>.<br/>Si vous n'êtes pas à l'origine de cette demande, n'en tenez pas compte.<br/><i>Ceci est un mail automatique, merci de ne pas y répondre.</i><br/><br/><br/>Cordialement,<br/>L'équipe des ourses à plumes.";

    private static final String NOTIFICATION_SUBJECT = "Notification d'article(s) à publier";
    private static final String NOTIFICATION_BODY = "Les articles suivants ont été mis à vérifier : <br/> {0} <br/><i>Ceci est un mail automatique, merci de ne pas y répondre.</i><br/><br/><br/>Cordialement,<br/>L'équipe des ourses à plumes.";
    
    @Override
    public boolean isMailValid(String mail) {
        return !Strings.isNullOrEmpty(mail) && MailHelperImpl.MAIL_PATTERN.matcher(mail).matches();
    }
    
    @Override
    public void renewPassword(String renewUrl,String mail) {
        // build mail
        Properties props = new Properties();
        props.put("mail.smtp.host", "mail.gandi.net");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");

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
            message.setSubject(RENEW_SUBJECT);
            message.setText(RENEW_BODY.replace("{0}", renewUrl), "utf-8", "html");
            Transport.send(message);
        }
        catch (MessagingException e) {
            logger.error("error renew password by mail", e);
        }
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
            Transport.send(message);
        }
        catch (MessagingException e) {
            logger.error("error sharing article by mail", e);
        }
    }

	@Override
	public void sendNotification(Collection<String> mails, Set<Article> articles) {
		// build mail
        Properties props = new Properties();
        props.put("mail.smtp.host", "mail.gandi.net");
        props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.auth", "true");

        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(EnvironnementVariable.SHARE_MAIL_ACCOUNT,
                        EnvironnementVariable.SHARE_MAIL_PASSWORD);
            }
        });

        try {
        	//Vérification des mails et construction de la liste de mails
        	String mailList = Joiner.on(",").join(Collections2.filter(mails, new Predicate<String>() {

				@Override
				public boolean apply(String arg0) {
					return isMailValid(arg0);
				}
			}));
        	StrBuilder sb = new StrBuilder();
        	sb.append("<ul><li>");
        	sb.appendWithSeparators(Collections2.transform(articles, new Function<Article, String>() {

				@Override
				public String apply(Article input) {
					return "<a href=\"http://" + EnvironnementVariable.DOMAIN_NAME + input.getPath() + "\">" + input.getTitle() + "</a>";
				}
			}), "</li><li>");
        	sb.append("</li></ul>");
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(EnvironnementVariable.SHARE_MAIL_ACCOUNT));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(mailList));
            message.setSubject(NOTIFICATION_SUBJECT);
            message.setText(NOTIFICATION_BODY.replace("{0}", sb), "utf-8", "html");
            Transport.send(message);
        }
        catch (MessagingException e) {
            logger.error("error renew password by mail", e);
        }
		
	}
}
