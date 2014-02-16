package org.ourses.server.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.ourses.server.domain.jsondto.administration.LoginDTO;

@Path("/authc")
public class AuthenticationResources {
	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response authentication(LoginDTO loginDto){
		try {
            SecurityUtils.getSubject().login(loginDto.toAuthcToken());
        }
        catch (AuthenticationException e) {
        	e.printStackTrace();
        	return Response.status(Status.UNAUTHORIZED).build();
        }
		return Response.ok(loginDto).build();
	}

}
