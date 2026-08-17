package CloudSecurityDigitalTwin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import CloudSecurityDigitalTwin.domain.Resource;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
}