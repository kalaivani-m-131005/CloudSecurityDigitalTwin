package CloudSecurityDigitalTwin.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

	private static final HealthResponse HEALTH_UP = new HealthResponse(
			"UP",
			"cloud-security-digital-twin");

	@GetMapping
	public ResponseEntity<HealthResponse> health() {
		return ResponseEntity.ok(HEALTH_UP);
	}
}
