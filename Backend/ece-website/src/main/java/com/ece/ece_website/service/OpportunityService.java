package com.ece.ece_website.service;
import com.ece.ece_website.entity.Opportunity;
import com.ece.ece_website.dto.OpportunityRequest;
import com.ece.ece_website.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
@Service @RequiredArgsConstructor
public class OpportunityService {
 private final OpportunityRepository repository;
 private final ContentValidation v;
 private final ProjectRepository projects;
 @Transactional public Opportunity save(Long id, OpportunityRequest r) {
  var e=id==null ? new Opportunity() : repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Record unavailable"));
  String slug=v.slug(r.slug());
  if(repository.existsBySlugAndIdNot(slug,id==null?-1L:id)) throw new ResponseStatusException(HttpStatus.CONFLICT,"Slug already exists");
  if(r.title()==null || r.title().isBlank()) ContentValidation.fail("Title is required");
  if(r.startDate()!=null && r.endDate()!=null && r.endDate().isBefore(r.startDate())) ContentValidation.fail("End date precedes start date");
  if(r.opensAt()!=null && r.applicationDeadline()!=null && !r.opensAt().isBefore(r.applicationDeadline())) ContentValidation.fail("Opening time must precede deadline");
  if(r.availability()==null || !java.util.Set.of("OPEN","CLOSED","UPCOMING").contains(r.availability())) ContentValidation.fail("Invalid availability");
  if(r.minimumAge()!=null && (r.minimumAge()<0 || r.minimumAge()>150) || r.maximumAge()!=null && (r.maximumAge()<0 || r.maximumAge()>150) || r.minimumAge()!=null && r.maximumAge()!=null && r.minimumAge()>r.maximumAge()) ContentValidation.fail("Invalid age range");
  if(r.relatedProjectUuid()!=null && projects.findByUuid(r.relatedProjectUuid()).isEmpty()) ContentValidation.fail("Related project does not exist");
  e.setSlug(v.text(r.slug(),160));
  e.setTitle(v.text(r.title(),255));
  e.setDescription(v.text(r.description(),10000));
  e.setCategory(v.text(r.category(),255));
  e.setLocation(v.text(r.location(),255));
  e.setStartDate(r.startDate());
  e.setEndDate(r.endDate());
  e.setOpensAt(r.opensAt());
  e.setApplicationDeadline(r.applicationDeadline());
  e.setApplicationUrl(v.url(r.applicationUrl()));
  e.setPublished(r.published());
  e.setAvailability(v.text(r.availability(),255));
  e.setCountry(v.text(r.country(),255));
  e.setMinimumAge(r.minimumAge());
  e.setMaximumAge(r.maximumAge());
  e.setRelatedProjectUuid(r.relatedProjectUuid());
  return repository.saveAndFlush(e);
 }
}
