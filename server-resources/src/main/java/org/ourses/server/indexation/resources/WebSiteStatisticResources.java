package org.ourses.server.indexation.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.ourses.server.indexation.helpers.StatisticsHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/statistic")
public class WebSiteStatisticResources {
	
	@Autowired
	StatisticsHelper statsHelper;

	@GET
	@Path("/home")
	@Produces(MediaType.APPLICATION_JSON)
	public Response findHomePageStatistic() {
		return Response.ok(statsHelper.findHomePageStatistic()).build();
	}
	
	@GET
	@Path("/articles")
	@Produces(MediaType.APPLICATION_JSON)
	public Response findArticlePageStatistic() {
		return Response.ok(statsHelper.findArticlePageStatistic()).build();
	}
}
