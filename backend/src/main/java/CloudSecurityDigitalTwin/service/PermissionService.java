package CloudSecurityDigitalTwin.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import CloudSecurityDigitalTwin.domain.Permission;
import CloudSecurityDigitalTwin.domain.Resource;
import CloudSecurityDigitalTwin.domain.Role;
import CloudSecurityDigitalTwin.repository.PermissionRepository;
import CloudSecurityDigitalTwin.repository.ResourceRepository;
import CloudSecurityDigitalTwin.repository.RoleRepository;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final ResourceRepository resourceRepository;
    private final RoleRepository roleRepository;

    public PermissionService(
            PermissionRepository permissionRepository,
            ResourceRepository resourceRepository,
            RoleRepository roleRepository) {
        this.permissionRepository = permissionRepository;
        this.resourceRepository = resourceRepository;
        this.roleRepository = roleRepository;
    }

    public Permission createPermission(Permission permission) {
        permission.setResource(resolveResource(permission));
        return permissionRepository.save(permission);
    }

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAllWithResource();
    }

    public Permission getPermissionById(Long id) {
        return permissionRepository.findByIdWithResource(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Permission not found with id: " + id));
    }

    public Permission updatePermission(Long id, Permission permission) {
        Permission existingPermission = getPermissionById(id);

        existingPermission.setAction(permission.getAction());
        existingPermission.setResource(resolveResource(permission));

        return permissionRepository.save(existingPermission);
    }

    @Transactional
    public void deletePermission(Long id) {
        Permission existingPermission = permissionRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Permission not found with id: " + id));

        for (Role role : roleRepository.findAllByPermissionId(id)) {
            role.getPermissions().removeIf(permission ->
                    id.equals(permission.getId()));
        }

        permissionRepository.delete(existingPermission);
    }

    private Resource resolveResource(Permission permission) {
        if (permission.getResource() == null
                || permission.getResource().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resource id is required");
        }

        Long resourceId = permission.getResource().getId();
        return resourceRepository.findById(resourceId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Resource not found with id: " + resourceId));
    }
}
