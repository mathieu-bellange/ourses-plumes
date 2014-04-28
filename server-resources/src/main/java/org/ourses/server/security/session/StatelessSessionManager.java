package org.ourses.server.security.session;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.SessionException;
import org.apache.shiro.session.mgt.SessionContext;
import org.apache.shiro.session.mgt.SessionKey;
import org.apache.shiro.web.session.mgt.WebSessionManager;

public class StatelessSessionManager implements WebSessionManager {

    @Override
    public boolean isServletContainerSessions() {
        // no session define
        return false;
    }

    @Override
    public Session start(SessionContext context) {
        // no session define
        return null;
    }

    @Override
    public Session getSession(SessionKey key) throws SessionException {
        // no session define
        return null;
    }

}
