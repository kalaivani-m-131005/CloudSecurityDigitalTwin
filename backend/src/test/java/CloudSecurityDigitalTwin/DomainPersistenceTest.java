package CloudSecurityDigitalTwin;

import CloudSecurityDigitalTwin.domain.SensitivityLevel;
import CloudSecurityDigitalTwin.repository.IdentityRepository;
import CloudSecurityDigitalTwin.repository.PermissionRepository;
import CloudSecurityDigitalTwin.repository.ResourceRepository;
import CloudSecurityDigitalTwin.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DomainPersistenceTest {

    @Autowired
    private IdentityRepository identityRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Test
    void repositoriesShouldBeLoaded() {
        assertThat(identityRepository).isNotNull();
        assertThat(roleRepository).isNotNull();
        assertThat(permissionRepository).isNotNull();
        assertThat(resourceRepository).isNotNull();
    }

    @Test
    void sensitivityLevelShouldContainExpectedValues() {
        assertThat(SensitivityLevel.values())
                .containsExactly(
                        SensitivityLevel.PUBLIC,
                        SensitivityLevel.INTERNAL,
                        SensitivityLevel.CONFIDENTIAL,
                        SensitivityLevel.CRITICAL
                );
    }
}