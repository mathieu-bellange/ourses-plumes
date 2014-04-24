package org.ourses.server.external.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.ourses.server.external.GithubRequest;
import org.ourses.server.external.domain.dto.GithubBug;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/github")
public class GithubResources {

    @Autowired
    private GithubRequest githubService;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    // TODO activé securité @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response addBug(GithubBug githubBug) {
        githubService.addIssue(githubBug);
        return Response.ok(githubBug).build();
    }

}
