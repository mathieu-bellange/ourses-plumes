package org.ourses.server.resources;

import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ourses.server.domain.entities.administration.OursesAuthorizationInfo;
import org.ourses.server.domain.jsondto.administration.OursesAuthzInfoDTO;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Collections2;
import com.google.common.collect.Sets;

@Controller
@Path("/role")
public class OursesAuthzInfoResources {

	@GET
    @Produces(MediaType.APPLICATION_JSON)
    public Set<OursesAuthzInfoDTO> findAllRoles() {
        Set<OursesAuthorizationInfo> oursesAuthorizationInfos = OursesAuthorizationInfo.findAllRoles();
        Set<OursesAuthzInfoDTO> oursesAuthzInfoToReturn = Sets.newHashSet(Collections2.transform(oursesAuthorizationInfos,
                new Function<OursesAuthorizationInfo, OursesAuthzInfoDTO>() {

                    @Override
                    public OursesAuthzInfoDTO apply(OursesAuthorizationInfo input) {
                        return input.toOursesAuthzInfoDTO();
                    }
                }).iterator());
        return oursesAuthzInfoToReturn;
    }
}
