
package CloudSecurityDigitalTwin.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import CloudSecurityDigitalTwin.domain.Permission;
import CloudSecurityDigitalTwin.domain.Role;
import CloudSecurityDigitalTwin.repository.PermissionRepository;
import CloudSecurityDigitalTwin.repository.RoleRepository;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(
            RoleRepository roleRepository,
            PermissionRepository permissionRepository) {

        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return roleRepository.findAllWithPermissions();
    }

    @Transactional(readOnly = true)
    public Role getRoleById(Long id) {

        return roleRepository.findByIdWithPermissions(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + id));
    }

    @Transactional
    public Role updateRole(Long id, Role role) {

        Role existingRole = roleRepository.findByIdWithPermissions(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + id));

        existingRole.setName(role.getName());
        existingRole.setDescription(role.getDescription());

        return roleRepository.save(existingRole);
    }

    @Transactional
    public Role addPermissionToRole(Long roleId, Long permissionId) {

        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + roleId));

        Permission permission = permissionRepository
                .findByIdWithResource(permissionId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Permission not found with id: " + permissionId));

        role.getPermissions().add(permission);

        Role savedRole = roleRepository.save(role);

        savedRole.getPermissions().size();

        return savedRole;
    }

    @Transactional(readOnly = true)
    public List<Permission> getPermissionsForRole(Long roleId) {

        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + roleId));

        return new ArrayList<>(role.getPermissions());
    }

    @Transactional
    public void removePermissionFromRole(
            Long roleId,
            Long permissionId) {

        Role role = roleRepository.findByIdWithPermissions(roleId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + roleId));

        Permission permission = permissionRepository
                .findById(permissionId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Permission not found with id: " + permissionId));

        role.getPermissions().removeIf(
                p -> p.getId().equals(permission.getId()));

        roleRepository.save(role);
    }

    @Transactional
    public void deleteRole(Long id) {

        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Role not found with id: " + id));

        roleRepository.delete(existingRole);
    }
}