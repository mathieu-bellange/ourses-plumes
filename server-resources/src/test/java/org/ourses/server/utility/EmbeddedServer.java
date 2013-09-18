package org.ourses.server.utility;

import org.junit.rules.ExternalResource;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.webapp.WebAppContext;

public class EmbeddedServer extends ExternalResource {

    Server server;
    int port = 8888;

    @Override
    protected void before() throws Throwable {
        server = new Server(port);
        WebAppContext context = new WebAppContext("src/main/webapp", "/");
        server.addHandler(context);
        server.start();
    }

    @Override
    protected void after() {
        try {
            server.stop();
        }
        catch (Throwable t) {
        }
    }

    public String uri() {
        return "http://localhost:" + port;
    }
}
