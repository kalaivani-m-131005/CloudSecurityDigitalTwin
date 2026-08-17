package CloudSecurityDigitalTwin.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import CloudSecurityDigitalTwin.domain.Resource;
import CloudSecurityDigitalTwin.repository.ResourceRepository;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Resource not found with id: " + id));
    }

    public Resource updateResource(Long id, Resource resource) {
        Resource existingResource = getResourceById(id);

        existingResource.setName(resource.getName());
        existingResource.setResourceType(resource.getResourceType());
        existingResource.setCloudIdentifier(resource.getCloudIdentifier());
        existingResource.setSensitivityLevel(resource.getSensitivityLevel());

        return resourceRepository.save(existingResource);
    }

    public void deleteResource(Long id) {
        Resource existingResource = getResourceById(id);
        resourceRepository.delete(existingResource);
    }
}
