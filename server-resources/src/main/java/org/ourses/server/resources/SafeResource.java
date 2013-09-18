package org.ourses.server.resources;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

import org.apache.shiro.SecurityUtils;

@Path("/safe")
public class SafeResource {

    @GET
    public Response get() {
        String state;
        if (SecurityUtils.getSubject().hasRole("vip")) {
            state = "authorized";
        }
        else {
            state = "authenticated";
        }
        return Response.ok(state).build();
    }
}
