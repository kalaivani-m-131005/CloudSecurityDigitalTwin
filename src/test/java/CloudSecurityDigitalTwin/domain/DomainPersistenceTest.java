package CloudSecurityDigitalTwin.domain;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class DomainPersistenceTest {

    private final Validator validator =
            Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void sensitivityLevelShouldContainExpectedValues() {
        assertArrayEquals(
                new SensitivityLevel[]{
                        SensitivityLevel.PUBLIC,
                        SensitivityLevel.INTERNAL,
                        SensitivityLevel.CONFIDENTIAL,
                        SensitivityLevel.CRITICAL
                },
                SensitivityLevel.values()
        );
    }

    @Test
    void validResourceShouldPassValidation() {
        Resource resource = new Resource();
        resource.setName("Production Database");
        resource.setResourceType("AWS_RDS");
        resource.setCloudIdentifier("prod-db-001");
        resource.setSensitivityLevel(SensitivityLevel.CRITICAL);

        Set<ConstraintViolation<Resource>> violations =
                validator.validate(resource);

        assertTrue(violations.isEmpty());
    }

    @Test
    void invalidResourceShouldFailValidation() {
        Resource resource = new Resource();

        Set<ConstraintViolation<Resource>> violations =
                validator.validate(resource);

        assertFalse(violations.isEmpty());
    }

    @Test
    void invalidIdentityEmailShouldFailValidation() {
        Identity identity = new Identity();
        identity.setName("Test User");
        identity.setEmail("invalid-email");

        Set<ConstraintViolation<Identity>> violations =
                validator.validate(identity);

        assertFalse(violations.isEmpty());
    }
}