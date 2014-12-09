package org.ourses.server.security.resources;

import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
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
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthorizationResources {

    @GET
    @Path("/roles")
    public Response findAllRoles() {
        Set<OursesAuthorizationInfo> oursesAuthorizationInfos = OursesAuthorizationInfo.findAllRoles();
        Set<OursesAuthzInfoDTO> oursesAuthzInfoToReturn = Sets.newHashSet(Collections2.transform(
                oursesAuthorizationInfos, new Function<OursesAuthorizationInfo, OursesAuthzInfoDTO>() {

                    @Override
                    public OursesAuthzInfoDTO apply(OursesAuthorizationInfo input) {
                        return input.toOursesAuthzInfoDTO();
                    }
                }).iterator());
        // cache = 30 days
        CacheControl cacheControl = new CacheControl();
        cacheControl.setMaxAge(2592000);
        return Response.ok(oursesAuthzInfoToReturn).cacheControl(cacheControl).build();
    }

    @GET
    @Path("/isadmin")
    public Response isAdmin() {
        // no cache
        return Response.noContent().build();
    }

    @GET
    @Path("/isredac")
    public Response isRedac() {
        // no cache
        return Response.noContent().build();
    }
}
