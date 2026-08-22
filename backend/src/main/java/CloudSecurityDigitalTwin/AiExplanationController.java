package CloudSecurityDigitalTwin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@RestController
@RequestMapping("/api/explain")
public class AiExplanationController {

    @Value("${openrouter.api.key:demo-mode}")
    private String apiKey;

    @PostMapping
    public Map<String, Object> explain(@RequestBody Map<String, Object> request) {
        String identityId  = (String) request.getOrDefault("identityId", "unknown");
        Object blastRadius = request.getOrDefault("blastRadius", 0);
        Object riskScore   = request.getOrDefault("riskScore", 0);
        Object riskLevel   = request.getOrDefault("riskLevel", "UNKNOWN");
        Object resources   = request.getOrDefault("reachableResources", List.of());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("identityId", identityId);
        result.put("riskScore",  riskScore);
        result.put("riskLevel",  riskLevel);

        try {
            String prompt = String.format(
                "You are a cloud security expert. Analyze this identity compromise:\n" +
                "Identity: %s | Risk Level: %s | Risk Score: %s/100\n" +
                "Blast Radius: %s resources affected | Resources: %s\n\n" +
                "Reply in EXACTLY this format:\n" +
                "EXPLANATION: (2-3 sentences plain English)\n" +
                "RECOMMENDATION: (3 specific fix actions)",
                identityId, riskLevel, riskScore, blastRadius, resources
            );

            RestTemplate rest = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "https://cloud-security-twin.app");
            headers.set("X-Title", "Cloud Security Digital Twin");

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", "gryphe/mythomax-l2-13b");
            body.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = rest.postForEntity(
                "https://openrouter.ai/api/v1/chat/completions",
                entity, Map.class
            );

            List<Map<String, Object>> choices =
                (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message =
                (Map<String, Object>) choices.get(0).get("message");
            String aiText = (String) message.get("content");

            String[] parts = aiText.split("RECOMMENDATION:", 2);
            result.put("explanation",    parts[0].replace("EXPLANATION:", "").trim());
            result.put("recommendation", parts.length > 1 ? parts[1].trim() : aiText);
            result.put("mode",           "ai-powered-llama-free");

        } catch (Exception e) {
            result.put("explanation",    buildFallback(identityId, riskLevel, blastRadius, resources));
            result.put("recommendation", buildRecommendation(identityId, riskLevel));
            result.put("mode",           "demo-fallback");
            result.put("error",          e.getMessage());
        }

        return result;
    }

    private String buildFallback(String id, Object level, Object blast, Object resources) {
        return String.format(
            "Identity '%s' compromised with %s risk. " +
            "Attacker reaches %s resources %s via excessive permissions.",
            id, level, blast, resources);
    }

    private String buildRecommendation(String id, Object level) {
        if ("CRITICAL".equals(level) || "HIGH".equals(level))
            return "1. Revoke admin permissions from " + id +
                   ". 2. Enable MFA. 3. Apply least-privilege. 4. Enable CloudTrail alerts.";
        return "1. Review permissions. 2. Enable MFA. 3. Quarterly access review.";
    }
}