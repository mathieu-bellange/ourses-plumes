package org.ourses.server.newsletter.helper;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.google.common.base.Strings;

@Component
public class MailHelperImpl implements MailHelper {

    private static final Pattern MAIL_PATTERN = Pattern
            .compile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

    @Override
    public boolean isMailValid(String mail) {
        return !Strings.isNullOrEmpty(mail) && MailHelperImpl.MAIL_PATTERN.matcher(mail).matches();
    }
}
