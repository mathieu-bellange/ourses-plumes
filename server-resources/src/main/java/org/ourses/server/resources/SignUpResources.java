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
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class SignUpResources {

    @Autowired
    BearAccountHelper accountHelper;

    @POST
    @Path("/pseudo")
    public Response checkPseudo(String pseudo) {
        Status status = Status.FORBIDDEN;
        if (accountHelper.isPseudoValid(pseudo) && accountHelper.isNewPseudo(pseudo)) {
            status = Status.NO_CONTENT;
        }
        return Response.status(status).build();
    }

    @POST
    @Path("/mail")
    public Response checkMail(String mail) {
        Status status = Status.FORBIDDEN;
        if (accountHelper.isMailValid(mail) && accountHelper.isNewMail(mail)) {
            status = Status.NO_CONTENT;
        }
        return Response.status(status).build();
    }

    @POST
    @Path("/password")
    public Response checkPassword(String password) {
        Status status = Status.FORBIDDEN;
        if (accountHelper.isPasswordValid(password)) {
            status = Status.NO_CONTENT;
        }
        return Response.status(status).build();
    }

}
