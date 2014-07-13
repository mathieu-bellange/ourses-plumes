package org.ourses.server.security.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.ourses.server.administration.domain.dto.OursesAuthzInfoDTO;
import org.ourses.server.administration.domain.entities.OursesAuthorizationInfo;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Sets;

@Controller
@Path("/authz")
public class AuthorizationResources {

	@GET
    @Produces(MediaType.APPLICATION_JSON)
	@Path("/roles")
    public Response findAllRoles() {
        Set<OursesAuthorizationInfo> oursesAuthorizationInfos = OursesAuthorizationInfo.findAllRoles();
        Set<OursesAuthzInfoDTO> oursesAuthzInfoToReturn = Sets.newHashSet(Collections2.transform(oursesAuthorizationInfos,
                new Function<OursesAuthorizationInfo, OursesAuthzInfoDTO>() {

                    @Override
                    public OursesAuthzInfoDTO apply(OursesAuthorizationInfo input) {
                        return input.toOursesAuthzInfoDTO();
                    }
                }).iterator());
        return Response.ok(oursesAuthzInfoToReturn).build();
    }
	
	@GET
    @Path("/isadmin")
    public Response isAdmin() {
        return Response.ok().build();
    }
	
	@GET
    @Path("/isredac")
    public Response isRedac() {
        return Response.ok().build();
    }
}
