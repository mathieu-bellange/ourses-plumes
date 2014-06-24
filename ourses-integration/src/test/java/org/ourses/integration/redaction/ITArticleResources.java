package org.ourses.integration.redaction;

import static org.fest.assertions.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;

import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.junit.Test;
import org.ourses.integration.util.TestHelper;
import org.ourses.server.redaction.domain.dto.ArticleDTO;
import org.ourses.server.redaction.domain.dto.CategoryDTO;
import org.ourses.server.redaction.domain.dto.RubriqueDTO;
import org.ourses.server.redaction.domain.entities.ArticleStatus;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;

public class ITArticleResources {

    private static final String PATH_DRAFT_CREATE = "/rest/articles/draft/create";
    private static final String PATH_DRAFT_UPDATE = "/rest/articles/draft/1";
    private static final String PATH_ANOTHER_DRAFT_UPDATE = "/rest/articles/draft/3";
    private static final String PATH_DRAFT_UPDATE_VALIDATE = "/rest/articles/draft/2";

    @Test
    public void shouldCreateArticleWithRedacRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();

        ArticleDTO newArticle = newArticle();
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, newArticle);
        // status attendu 201
        assertThat(clientResponse.getStatus()).isEqualTo(201);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getId()).isNotNull();
        assertThat(article.getTitle()).isEqualTo(newArticle.getTitle());
        assertThat(article.getDescription()).isEqualTo(newArticle.getDescription());
        assertThat(article.getBody()).isEqualTo(newArticle.getBody());
        assertThat(article.getCategory()).isEqualTo(newArticle.getCategory());
        assertThat(article.getRubrique()).isEqualTo(newArticle.getRubrique());
        assertThat(article.getProfile().getPseudo()).isEqualTo("jpetit");
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.BROUILLON);
    }

    @Test
    public void shouldCreateArticleWithAdminRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();
        ArticleDTO newArticle = newArticle();
        ClientResponse clientResponse = TestHelper.webResourceWithAdminRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, newArticle);
        // status attendu 201
        assertThat(clientResponse.getStatus()).isEqualTo(201);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
    }

    @Test
    public void shouldNotCreateArticleWithoutRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_CREATE).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .put(ClientResponse.class, new ArticleDTO());
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldUpdateDraft() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(1l);
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 200
        assertThat(clientResponse.getStatus()).isEqualTo(200);
        ArticleDTO article = clientResponse.getEntity(ArticleDTO.class);
        assertThat(article).isNotNull();
        assertThat(article.getId()).isEqualTo(1l);
        assertThat(article.getTitle()).isEqualTo(updateArticle.getTitle());
        assertThat(article.getDescription()).isEqualTo(updateArticle.getDescription());
        assertThat(article.getBody()).isEqualTo(updateArticle.getBody());
        assertThat(article.getCategory()).isEqualTo(updateArticle.getCategory());
        assertThat(article.getRubrique()).isEqualTo(updateArticle.getRubrique());
        assertThat(article.getProfile().getPseudo()).isEqualTo("jpetit");
        assertThat(article.getStatus()).isEqualTo(ArticleStatus.BROUILLON);
    }

    @Test
    public void shouldNotUpdateDraftWithAnotherDraft() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(2l);
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldNotUpdateDraftToOtherPeople() {
        URI uri = UriBuilder.fromPath(PATH_ANOTHER_DRAFT_UPDATE).build();
        ArticleDTO updateArticle = updateArticle(1l);
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldNotUpdateDraftWithValidateArticle() {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE_VALIDATE).build();
        ArticleDTO updateArticle = updateArticle(1l);
        ClientResponse clientResponse = TestHelper.webResourceWithRedacRole(uri)
                .header("Content-Type", "application/json").put(ClientResponse.class, updateArticle);
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    @Test
    public void shouldNotUpdateArticleWithoutRole() throws JsonGenerationException, JsonMappingException,
            UniformInterfaceException, ClientHandlerException, IOException {
        URI uri = UriBuilder.fromPath(PATH_DRAFT_UPDATE).build();
        ClientResponse clientResponse = TestHelper.webResource(uri).header("Content-Type", "application/json")
                .put(ClientResponse.class, new ArticleDTO());
        // status attendu 401
        assertThat(clientResponse.getStatus()).isEqualTo(401);
    }

    private ArticleDTO newArticle() {
        ArticleDTO newArticle = new ArticleDTO();
        newArticle.setTitle("title");
        newArticle.setDescription("desc");
        newArticle.setBody("body");
        CategoryDTO cat = new CategoryDTO(2l, "reportage");
        newArticle.setCategory(cat);
        RubriqueDTO rubrique = new RubriqueDTO(1l, "luttes");
        newArticle.setRubrique(rubrique);
        return newArticle;
    }

    private ArticleDTO updateArticle(long id) {
        ArticleDTO newArticle = new ArticleDTO();
        newArticle.setId(id);
        newArticle.setTitle("title 2");
        newArticle.setDescription("desc 2");
        newArticle.setBody("body 2");
        CategoryDTO cat = new CategoryDTO(3l, "dossier");
        newArticle.setCategory(cat);
        RubriqueDTO rubrique = new RubriqueDTO(2l, "corps");
        newArticle.setRubrique(rubrique);
        return newArticle;
    }
}
