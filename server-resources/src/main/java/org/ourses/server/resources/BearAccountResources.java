package org.ourses.server.resources;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.ourses.server.domain.entities.administration.BearAccount;
import org.ourses.server.domain.jsondto.administration.BearAccountDTO;

@Path("/account")
public class BearAccountResources {

	
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response createAccount(BearAccountDTO bearAccountDTO){
		bearAccountDTO.toBearAccount().save();
		return Response.ok().build();
	}
	
	@DELETE
	@Path("/{id}")
	public Response deleteAccount(@PathParam("id") long id){
		BearAccount bearAccount = new BearAccount();
		bearAccount.setId(id);
		bearAccount.delete();
		return Response.ok().build();
	}
}
