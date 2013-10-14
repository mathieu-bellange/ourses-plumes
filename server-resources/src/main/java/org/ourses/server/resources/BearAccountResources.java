package org.ourses.server.resources;

import java.util.List;

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

import org.apache.shiro.authz.annotation.RequiresRoles;
import org.ourses.server.authentication.util.RolesUtil;
import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;
import org.springframework.stereotype.Controller;

import com.google.common.base.Function;
import com.google.common.collect.Lists;

@Controller
@Path("/account")
public class BearAccountResources {

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response createAccount(BearAccountDTO bearAccountDTO) {
        bearAccountDTO.toBearAccount().save();
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    @RequiresRoles(value = { RolesUtil.ADMINISTRATRICE })
    public Response deleteAccount(@PathParam("id")
    long id) {
        BearAccount bearAccount = new BearAccount();
        bearAccount.setId(id);
        bearAccount.delete();
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RequiresRoles(RolesUtil.ADMINISTRATRICE)
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
