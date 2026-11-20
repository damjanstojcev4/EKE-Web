package com.ece.ece_website.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="opportunities") @Data
public class Opportunity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(length=160, unique=true, nullable=false) private String slug;
 @Column(length=255) private String title;
 @Column(length=10000) private String description;
 @Column(length=255) private String category;
 @Column(length=255) private String location;
  private java.time.LocalDate startDate;
  private java.time.LocalDate endDate;
  private java.time.Instant opensAt;
  private java.time.Instant applicationDeadline;
 @Column(length=2000) private String applicationUrl;
  private boolean published;
 @Column(length=255) private String availability;
 @Column(length=255) private String country;
  private Integer minimumAge;
  private Integer maximumAge;
  private java.util.UUID relatedProjectUuid;
 @ManyToOne(fetch=FetchType.LAZY)
 @JoinColumn(name="relatedProjectUuid", referencedColumnName="uuid", insertable=false, updatable=false)
 @com.fasterxml.jackson.annotation.JsonIgnore
 @lombok.ToString.Exclude
 @lombok.EqualsAndHashCode.Exclude
 private Project relatedProject;
 private java.time.Instant createdAt;
 private java.time.Instant updatedAt;
 @PrePersist void create() { createdAt=java.time.Instant.now(); updatedAt=createdAt; }
 @PreUpdate void update() { updatedAt=java.time.Instant.now(); }
 public String getLifecycle() {
  if (!published) return "UNPUBLISHED";
  var now=java.time.Instant.now();
  if ("CLOSED".equals(availability) || (applicationDeadline!=null && !now.isBefore(applicationDeadline)) || (endDate!=null && endDate.isBefore(java.time.LocalDate.now(java.time.ZoneId.of("Europe/Skopje"))))) return "CLOSED";
  if ("UPCOMING".equals(availability) || (opensAt!=null && now.isBefore(opensAt))) return "UPCOMING";
  return "OPEN";
 }
}
