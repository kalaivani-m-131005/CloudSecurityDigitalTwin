
package CloudSecurityDigitalTwin.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import CloudSecurityDigitalTwin.domain.Identity;
import CloudSecurityDigitalTwin.domain.Role;
import CloudSecurityDigitalTwin.service.IdentityService;

@RestController
@RequestMapping("/api/identities")
public class IdentityController {

    private final IdentityService identityService;

    public IdentityController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @PostMapping
    public ResponseEntity<Identity> createIdentity(
            @RequestBody Identity identity) {

        return ResponseEntity.ok(
                identityService.createIdentity(identity));
    }

    @GetMapping
    public ResponseEntity<List<Identity>> getAllIdentities() {

        return ResponseEntity.ok(
                identityService.getAllIdentities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Identity> getIdentityById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                identityService.getIdentityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Identity> updateIdentity(
            @PathVariable Long id,
            @RequestBody Identity identity) {

        return ResponseEntity.ok(
                identityService.updateIdentity(id, identity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIdentity(
            @PathVariable Long id) {

        identityService.deleteIdentity(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{identityId}/roles/{roleId}")
    public ResponseEntity<Identity> addRoleToIdentity(
            @PathVariable Long identityId,
            @PathVariable Long roleId) {

        return ResponseEntity.ok(
                identityService.addRoleToIdentity(
                        identityId,
                        roleId));
    }

    @GetMapping("/{identityId}/roles")
    public ResponseEntity<List<Role>> getRolesForIdentity(
            @PathVariable Long identityId) {

        return ResponseEntity.ok(
                identityService.getRolesForIdentity(identityId));
    }

    @DeleteMapping("/{identityId}/roles/{roleId}")
    public ResponseEntity<Void> removeRoleFromIdentity(
            @PathVariable Long identityId,
            @PathVariable Long roleId) {

        identityService.removeRoleFromIdentity(
                identityId,
                roleId);

        return ResponseEntity.noContent().build();
    }
}
