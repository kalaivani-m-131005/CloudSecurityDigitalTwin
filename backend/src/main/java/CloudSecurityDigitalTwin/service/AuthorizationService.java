package CloudSecurityDigitalTwin.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import CloudSecurityDigitalTwin.domain.Identity;
import CloudSecurityDigitalTwin.domain.Permission;
import CloudSecurityDigitalTwin.domain.Role;
import CloudSecurityDigitalTwin.repository.IdentityRepository;

@Service
public class AuthorizationService {

    private final IdentityRepository identityRepository;

    public AuthorizationService(
            IdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Transactional(readOnly = true)
    public boolean isAllowed(
            Long identityId,
            Long resourceId,
            String action) {

        Identity identity = identityRepository.findById(identityId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Identity not found with id: " + identityId));

        return identity.getRoles()
                .stream()
                .flatMap(role -> role.getPermissions().stream())
                .anyMatch(permission ->
                        permission.getAction().equalsIgnoreCase(action)
                        && permission.getResource().getId().equals(resourceId));
    }
}