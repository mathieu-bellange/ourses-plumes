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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

@Component
public final class CrawlFilter implements Filter {

    Logger logger = LoggerFactory.getLogger(CrawlFilter.class);
    BrowserVersion browser = BrowserVersion.INTERNET_EXPLORER_11;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        if ((httpRequest.getQueryString() != null) && (httpRequest.getQueryString().contains("_escaped_fragment_"))) {
            // Rewrite the URL back to the original #! version
            // Remember to unescape any %XX characters
            // String url_with_hash_fragment = rewriteQueryString(httpRequest.getQueryString());
            logger.debug("Crawl page : {}", httpRequest.getRequestURI());
            // Set up dummy browser properties (i.e. customise user agent)
            browser.setUserAgent("Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko [crawl_filter]");
            // Set an headless browser to obtain an HTML snapshot
            final WebClient webClient = new WebClient(browser);
            webClient.addRequestHeader("Accept-Charset", "utf-8");
            // Set and trigger a web request for the headless browser (i.e. simulate http get)
            WebRequest webRequest = new WebRequest(new URL(httpRequest.getScheme() + "://" + httpRequest.getServerName()
            + ":" + httpRequest.getServerPort() + httpRequest.getRequestURI()));
            HtmlPage page = webClient.getPage(webRequest);
            // Important ! Give the headless browser enough time to execute JavaScript
            // The exact time to wait may depend on your application.
            webClient.waitForBackgroundJavaScript(5000);
            // Return the snapshot
            response.getWriter().write(page.asXml());
        }
        else {
            try {
                // Not an _escaped_fragment_ URL, so move up the chain of servlet (filters)
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
