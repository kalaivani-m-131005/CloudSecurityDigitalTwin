package CloudSecurityDigitalTwin.repository;

import CloudSecurityDigitalTwin.domain.CloudResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CloudResourceRepository extends JpaRepository<CloudResource, Long> {
    List<CloudResource> findByOwnerUsername(String ownerUsername);
    List<CloudResource> findByResourceType(String resourceType);
}