package CloudSecurityDigitalTwin.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import CloudSecurityDigitalTwin.service.AuthorizationService;

@RestController
@RequestMapping("/api/authorization")
public class AuthorizationController {

    private final AuthorizationService authorizationService;

    public AuthorizationController(
            AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PostMapping("/check")
    public ResponseEntity<Boolean> checkAuthorization(
            @RequestParam Long identityId,
            @RequestParam Long resourceId,
            @RequestParam String action) {

        boolean allowed = authorizationService.isAllowed(
                identityId,
                resourceId,
                action);

        return ResponseEntity.ok(allowed);
    }
}