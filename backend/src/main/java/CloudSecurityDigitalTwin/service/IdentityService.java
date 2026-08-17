
package CloudSecurityDigitalTwin.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import CloudSecurityDigitalTwin.domain.Identity;
import CloudSecurityDigitalTwin.domain.Role;
import CloudSecurityDigitalTwin.repository.IdentityRepository;
import CloudSecurityDigitalTwin.repository.RoleRepository;

@Service
public class IdentityService {

    private final IdentityRepository identityRepository;
    private final RoleRepository roleRepository;

    public IdentityService(
            IdentityRepository identityRepository,
            RoleRepository roleRepository) {

        this.identityRepository = identityRepository;
        this.roleRepository = roleRepository;
    }

    public Identity createIdentity(Identity identity) {
        return identityRepository.save(identity);
    }

    @Transactional(readOnly = true)
    public List<Identity> getAllIdentities() {
        return identityRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Identity getIdentityById(Long id) {

        return identityRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Identity not found with id: " + id));
    }

    @Transactional
    public Identity updateIdentity(
            Long id,
            Identity updatedIdentity) {

        Identity existingIdentity = getIdentityById(id);

        existingIdentity.setName(updatedIdentity.getName());
        existingIdentity.setEmail(updatedIdentity.getEmail());

        return identityRepository.save(existingIdentity);
    }

    @Transactional
    public Identity addRoleToIdentity(
            Long identityId,
            Long roleId) {

        Identity identity = getIdentityById(identityId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + roleId));

        identity.getRoles().add(role);

        return identityRepository.save(identity);
    }

    @Transactional(readOnly = true)
    public List<Role> getRolesForIdentity(Long identityId) {

        Identity identity = getIdentityById(identityId);

        return new ArrayList<>(identity.getRoles());
    }

    @Transactional
    public void removeRoleFromIdentity(
            Long identityId,
            Long roleId) {

        Identity identity = getIdentityById(identityId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + roleId));

        identity.getRoles().removeIf(
                r -> r.getId().equals(role.getId()));

        identityRepository.save(identity);
    }

    @Transactional
    public void deleteIdentity(Long id) {

        Identity existingIdentity = getIdentityById(id);

        identityRepository.delete(existingIdentity);
    }
}
