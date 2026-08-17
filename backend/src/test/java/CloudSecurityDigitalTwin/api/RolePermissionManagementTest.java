package CloudSecurityDigitalTwin.api;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RolePermissionManagementTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void createPermission_resolvesResourceById() throws Exception {
		long resourceId = createResource();

		mockMvc.perform(post("/api/permissions")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "action": "READ",
								  "resource": { "id": %d }
								}
								""".formatted(resourceId)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber())
				.andExpect(jsonPath("$.action").value("READ"))
				.andExpect(jsonPath("$.resource.id").value(resourceId))
				.andExpect(jsonPath("$.resource.name").value("Production Database"));
	}

	@Test
	void assignListAndRemovePermissionFromRole() throws Exception {
		long resourceId = createResource();
		long permissionId = createPermission(resourceId);
		long roleId = createRole();

		mockMvc.perform(post("/api/roles/{roleId}/permissions/{permissionId}",
						roleId, permissionId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(roleId))
				.andExpect(jsonPath("$.permissions[0].id").value(permissionId))
				.andExpect(jsonPath("$.permissions[0].resource.id").value(resourceId));

		mockMvc.perform(get("/api/roles/{roleId}/permissions", roleId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].id").value(permissionId))
				.andExpect(jsonPath("$[0].action").value("READ"))
				.andExpect(jsonPath("$[0].resource.id").value(resourceId));

		mockMvc.perform(delete("/api/roles/{roleId}/permissions/{permissionId}",
						roleId, permissionId))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/roles/{roleId}/permissions", roleId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(0));
	}

	@Test
	void missingRole_returns404() throws Exception {
		mockMvc.perform(get("/api/roles/{id}", 99999L))
				.andExpect(status().isNotFound());

		long permissionId = createPermission(createResource());
		mockMvc.perform(post("/api/roles/{roleId}/permissions/{permissionId}",
						99999L, permissionId))
				.andExpect(status().isNotFound());
	}

	@Test
	void missingPermission_returns404() throws Exception {
		mockMvc.perform(get("/api/permissions/{id}", 99999L))
				.andExpect(status().isNotFound());

		long roleId = createRole();
		mockMvc.perform(post("/api/roles/{roleId}/permissions/{permissionId}",
						roleId, 99999L))
				.andExpect(status().isNotFound());
	}

	private long createResource() throws Exception {
		MvcResult result = mockMvc.perform(post("/api/resources")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "name": "Production Database",
								  "resourceType": "AWS_RDS",
								  "cloudIdentifier": "prod-db-%s",
								  "sensitivityLevel": "CRITICAL"
								}
								""".formatted(UUID.randomUUID())))
				.andExpect(status().isCreated())
				.andReturn();

		return readId(result);
	}

	private long createPermission(long resourceId) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/permissions")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "action": "READ",
								  "resource": { "id": %d }
								}
								""".formatted(resourceId)))
				.andExpect(status().isCreated())
				.andReturn();

		return readId(result);
	}

	private long createRole() throws Exception {
		MvcResult result = mockMvc.perform(post("/api/roles")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "name": "auditor-%s",
								  "description": "Read-only auditor"
								}
								""".formatted(UUID.randomUUID())))
				.andExpect(status().isCreated())
				.andReturn();

		return readId(result);
	}

	private long readId(MvcResult result) throws Exception {
		JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
		return body.get("id").asLong();
	}
}
