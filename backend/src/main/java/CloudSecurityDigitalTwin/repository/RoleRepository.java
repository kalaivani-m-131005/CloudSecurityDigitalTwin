
package CloudSecurityDigitalTwin.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CloudSecurityDigitalTwin.domain.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query("""
            SELECT DISTINCT r FROM Role r
            LEFT JOIN FETCH r.permissions p
            LEFT JOIN FETCH p.resource
            WHERE r.id = :id
            """)
    Optional<Role> findByIdWithPermissions(@Param("id") Long id);

    @Query("""
            SELECT DISTINCT r FROM Role r
            LEFT JOIN FETCH r.permissions p
            LEFT JOIN FETCH p.resource
            """)
    List<Role> findAllWithPermissions();

    @Query("""
            SELECT r FROM Role r
            JOIN r.permissions p
            WHERE p.id = :permissionId
            """)
    List<Role> findAllByPermissionId(@Param("permissionId") Long permissionId);
}
