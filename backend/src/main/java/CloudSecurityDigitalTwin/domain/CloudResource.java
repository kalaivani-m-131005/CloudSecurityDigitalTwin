package CloudSecurityDigitalTwin.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "cloud_resources")
public class CloudResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String resourceType; // EC2, S3, IAM

    @Column(nullable = false)
    private String sensitivityLevel; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String state; // running, stopped, active

    @Column
    private String publicAccess; // true, false (for S3)

    @Column(nullable = false)
    private String ownerUsername;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    // Getters and Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }
    public String getSensitivityLevel() { return sensitivityLevel; }
    public void setSensitivityLevel(String sensitivityLevel) { this.sensitivityLevel = sensitivityLevel; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPublicAccess() { return publicAccess; }
    public void setPublicAccess(String publicAccess) { this.publicAccess = publicAccess; }
    public String getOwnerUsername() { return ownerUsername; }
    public void setOwnerUsername(String ownerUsername) { this.ownerUsername = ownerUsername; }
    public Instant getCreatedAt() { return createdAt; }
}