package CloudSecurityDigitalTwin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CloudSecurityDigitalTwin.domain.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

	@Query("""
			SELECT p FROM Permission p
			JOIN FETCH p.resource
			WHERE p.id = :id
			""")
	Optional<Permission> findByIdWithResource(@Param("id") Long id);

	@Query("""
			SELECT p FROM Permission p
			JOIN FETCH p.resource
			""")
	List<Permission> findAllWithResource();
}
