package org.ourses.server.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.authentication.helpers.BearAccountHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
@Path("/signup_check")
public class SignUpResources {

    @Autowired
    BearAccountHelper accountHelper;

    @POST
    @Path("/pseudo")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkPseudo(String pseudo) {
        Status status = Status.FORBIDDEN;
        if (accountHelper.isNewPseudo(pseudo)) {
            status = Status.NO_CONTENT;
        }
        return Response.status(status).build();
    }

    @POST
    @Path("/mail")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkMail(String mail) {
        Status status = Status.FORBIDDEN;
        if (accountHelper.isNewMail(mail)) {
            status = Status.NO_CONTENT;
        }
        return Response.status(status).build();
    }

}
