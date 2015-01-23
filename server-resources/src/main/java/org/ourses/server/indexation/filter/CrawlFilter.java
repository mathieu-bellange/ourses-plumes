package org.ourses.server.indexation.filter;

import java.io.IOException;
import java.net.URL;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

@Component
public final class CrawlFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        if ((httpRequest.getQueryString() != null) && (httpRequest.getQueryString().contains("_escaped_fragment_"))) {
            // rewrite the URL back to the original #! version
            // remember to unescape any %XX characters
            // String url_with_hash_fragment = rewriteQueryString(httpRequest.getQueryString());

            // use the headless browser to obtain an HTML snapshot
            final WebClient webClient = new WebClient(BrowserVersion.CHROME);
            webClient.addRequestHeader("Accept-Charset", "utf-8");
            HtmlPage page = webClient.getPage(new URL(httpRequest.getScheme() + "://" + httpRequest.getServerName()
                    + ":" + httpRequest.getServerPort() + httpRequest.getRequestURI()));

            // important! Give the headless browser enough time to execute JavaScript
            // The exact time to wait may depend on your application.
            webClient.waitForBackgroundJavaScript(1000);
            // return the snapshot
            response.getWriter().write(page.asXml());
        }
        else {
            try {
                // not an _escaped_fragment_ URL, so move up the chain of servlet (filters)
                chain.doFilter(request, response);
            }
            catch (ServletException e) {
                System.err.println("Servlet exception caught: " + e);
                e.printStackTrace();
            }
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void destroy() {

    }
}
