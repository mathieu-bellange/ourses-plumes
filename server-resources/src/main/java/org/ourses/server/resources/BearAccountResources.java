package org.ourses.server.resources;

import java.util.List;

import javax.annotation.Nullable;
import javax.persistence.OptimisticLockException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.exception.EntityIdNull;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;

@Controller
@Path("/account")
public class BearAccountResources {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createAccount(BearAccountDTO bearAccountDTO) {
        bearAccountDTO.toBearAccount().save();
        return Response.status(Status.CREATED).entity(bearAccountDTO).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateAccount(BearAccountDTO bearAccountDTO) {
        Response response;
        try {
            bearAccountDTO.toBearAccount().save();
            response = Response.ok(bearAccountDTO).build();
        }
        catch (OptimisticLockException ole) {
            response = Response.status(Status.INTERNAL_SERVER_ERROR)
                    .header(HTTPUtility.HEADER_ERROR, OptimisticLockException.class).build();
        }
        return response;
    }

    @DELETE
    @Path("/{id}")
    // @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response deleteAccount(@PathParam("id")
    long id) {
        Response response = Response.ok().build();
        BearAccount bearAccount = new BearAccount();
        bearAccount.setId(id);
        try {
            bearAccount.delete();
        }
        catch (EntityIdNull e) {
            response = Response.status(Status.INTERNAL_SERVER_ERROR)
                    .header(HTTPUtility.HEADER_ERROR, EntityIdNull.class).build();
        }
        return response;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    // @RequiresRoles(RolesUtil.ADMINISTRATRICE)
    public List<BearAccountDTO> findAllBearAccounts() {
        List<BearAccount> listBearAccount = BearAccount.findAllAdministrationBearAccounts();
        List<BearAccountDTO> listBearAccountDTO = Lists.transform(listBearAccount,
                new Function<BearAccount, BearAccountDTO>() {

                    @Override
                    @Nullable
                    public BearAccountDTO apply(@Nullable
                    BearAccount bearAccount) {
                        return bearAccount.toBearAccountDTO();
                    }
                });
        return listBearAccountDTO;
    }
}
