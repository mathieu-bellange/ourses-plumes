package org.ourses.server.resources;

import java.util.List;
import java.util.Set;

import javax.annotation.Nullable;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.entities.administration.OursesAuthorizationInfo;
import org.ourses.server.domain.exception.AccountProfileNullException;
import org.ourses.server.domain.exception.AuthenticationProfileNullException;
import org.ourses.server.domain.exception.AuthorizationProfileNullException;
import org.ourses.server.domain.exception.EntityIdNullException;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.ourses.server.domain.jsondto.util.PatchDto;
import org.ourses.server.resources.util.PATCH;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;

@Controller
@Path("/account")
public class BearAccountResources {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    // @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response createAccount(BearAccountDTO bearAccountDTO) {
        // on créé par défaut un compte en rédactrice
        BearAccount account = bearAccountDTO.toBearAccount();
        account.setAuthzInfo(OursesAuthorizationInfo.findRoleByName(RolesUtil.REDACTRICE));
        Response response = null;
        try {
            account.save();
            response = Response.status(Status.CREATED).entity(account.toBearAccountDTO()).build();
        }
        catch (AccountProfileNullException | AuthenticationProfileNullException | AuthorizationProfileNullException e) {
            response = Response.status(Status.INTERNAL_SERVER_ERROR).header(HTTPUtility.HEADER_ERROR, e.getClass())
                    .build();
        }
        return response;
    }

    @PATCH
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateAccount(@PathParam("id")
    long id, Set<PatchDto> setModification) {
        BearAccount bearAccount = BearAccount.find(id);
        bearAccount.update(setModification);
        return Response.ok().build();
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
        catch (EntityIdNullException e) {
            response = Response.status(Status.INTERNAL_SERVER_ERROR)
                    .header(HTTPUtility.HEADER_ERROR, EntityIdNullException.class).build();
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
