package CloudSecurityDigitalTwin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CloudSecurityDigitalTwin.domain.Identity;

@Repository
public interface IdentityRepository
        extends JpaRepository<Identity, Long> {

    @Query("""
            SELECT DISTINCT i
            FROM Identity i
            LEFT JOIN FETCH i.roles r
            LEFT JOIN FETCH r.permissions p
            LEFT JOIN FETCH p.resource
            WHERE i.id = :id
            """)
    Optional<Identity> findByIdWithAuthorization(
            @Param("id") Long id);
}