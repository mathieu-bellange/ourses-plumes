package org.ourses.server.redaction.resources;

import java.util.Collection;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.redaction.domain.dto.FolderDTO;
import org.ourses.server.redaction.helpers.FolderHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.google.common.net.HttpHeaders;

@Controller
@Path("/folder")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FolderRessources {

    @Autowired
    FolderHelper folderHelper;

    @GET
    public Response readAllFolder(@HeaderParam(HttpHeaders.AUTHORIZATION)
    final String token) {
        Collection<FolderDTO> folders = folderHelper.findAllFolder();
        CacheControl cacheControl = new CacheControl();
        cacheControl.setNoCache(true);
        cacheControl.setPrivate(true);
        return Response.status(Status.OK).entity(folders).cacheControl(cacheControl).build();
    }
}
