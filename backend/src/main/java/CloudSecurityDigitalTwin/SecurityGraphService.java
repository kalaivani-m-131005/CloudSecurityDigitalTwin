package CloudSecurityDigitalTwin;

import CloudSecurityDigitalTwin.domain.User;
import CloudSecurityDigitalTwin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/graph")
@CrossOrigin(origins = "*")
public class SecurityGraphService {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getSecurityGraph() {
        Map<String, Object> graph = new LinkedHashMap<>();

        List<Map<String, String>> nodes = new ArrayList<>();
        List<Map<String, String>> edges = new ArrayList<>();

        // Real users from DB
        List<User> users = userRepository.findAll();

        // Identity nodes — real DB users
        for (User user : users) {
            nodes.add(node("identity-" + user.getUsername(), user.getUsername(), "IDENTITY"));
        }

        // Role nodes
        nodes.add(node("role-admin",    "AdminRole",    "ROLE"));
        nodes.add(node("role-readonly", "ReadOnlyRole", "ROLE"));
        nodes.add(node("role-devops",   "DevOpsRole",   "ROLE"));

        // Permission nodes
        nodes.add(node("perm-admin-all",    "ALL_ACCESS",   "PERMISSION"));
        nodes.add(node("perm-read-only",    "READ_ONLY",    "PERMISSION"));
        nodes.add(node("perm-devops-write", "WRITE_DEPLOY", "PERMISSION"));

        // Resource nodes
        nodes.add(node("res-prod-db",     "prod-data-bucket", "RESOURCE"));
        nodes.add(node("res-bastion",     "bastion-host",     "RESOURCE"));
        nodes.add(node("res-dev-server",  "dev-api-server",   "RESOURCE"));
        nodes.add(node("res-prod-server", "prod-web-server",  "RESOURCE"));

        graph.put("nodes", nodes);

        // Edges — real users connected to roles based on their role
        for (User user : users) {
            String identityId = "identity-" + user.getUsername();
            if ("ADMIN".equals(user.getRole())) {
                edges.add(edge(identityId, "role-admin", "HAS_ROLE"));
            } else if ("DEVOPS".equals(user.getRole())) {
                edges.add(edge(identityId, "role-devops", "HAS_ROLE"));
            } else {
                edges.add(edge(identityId, "role-readonly", "HAS_ROLE"));
            }
        }

        // Permission edges
        edges.add(edge("role-admin",    "perm-admin-all",    "HAS_PERMISSION"));
        edges.add(edge("role-readonly", "perm-read-only",    "HAS_PERMISSION"));
        edges.add(edge("role-devops",   "perm-devops-write", "HAS_PERMISSION"));

        // Resource edges
        edges.add(edge("perm-admin-all",    "res-prod-db",     "CAN_ACCESS"));
        edges.add(edge("perm-admin-all",    "res-bastion",     "CAN_ACCESS"));
        edges.add(edge("perm-admin-all",    "res-prod-server", "CAN_ACCESS"));
        edges.add(edge("perm-admin-all",    "res-dev-server",  "CAN_ACCESS"));
        edges.add(edge("perm-read-only",    "res-dev-server",  "CAN_ACCESS"));
        edges.add(edge("perm-devops-write", "res-bastion",     "CAN_ACCESS"));
        edges.add(edge("perm-devops-write", "res-prod-server", "CAN_ACCESS"));

        graph.put("edges", edges);

        // Stats
        long identityCount = nodes.stream().filter(n -> "IDENTITY".equals(n.get("type"))).count();
        long resourceCount = nodes.stream().filter(n -> "RESOURCE".equals(n.get("type"))).count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalNodes",    nodes.size());
        stats.put("totalEdges",    edges.size());
        stats.put("identityNodes", identityCount);
        stats.put("roleNodes",     3);
        stats.put("permissionNodes", 3);
        stats.put("resourceNodes", resourceCount);
        graph.put("stats", stats);

        return graph;
    }

    private Map<String, String> node(String id, String label, String type) {
        Map<String, String> n = new LinkedHashMap<>();
        n.put("id",    id);
        n.put("label", label);
        n.put("type",  type);
        return n;
    }

    private Map<String, String> edge(String from, String to, String relation) {
        Map<String, String> e = new LinkedHashMap<>();
        e.put("from",     from);
        e.put("to",       to);
        e.put("relation", relation);
        return e;
    }
}