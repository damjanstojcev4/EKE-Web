# ECE - Website

### This is project consist of a Spring Boot backend and React + Tailwind CSS frontend. The app enables managing projects, images, files, project status and more.

## Backend API
## Features:
- CRUD Operations for projects
- Uploading and store project images and PDFs
- Store file paths in DB and serve files via URLs
- Project stats as ON GOING or PAST

### API Endpoints:
```
GET /
```
```
GET/ {TITLE}
```
```
POST/PROJECTS
```
```
PUT/{uuid}
```
```
DELETE/{uuid}
```
### File Storage:
- Images stored in /uploads/images/
- PDFs stored in /uploads/pdf/
- Filenames are UUID-prefixed for uniqeness
- URLs like /images/{imageFileName} and /images/pdf/{pdfFileName} are provided in API responses.

# Frontend Client
## Features
- The frontend communicates with the backend API to display projects, upload new projects, and update or delete existing projects.
- It retrieves project data including URLs for images and PDFs, displaying them inline or providing download/view links.
- Supports creating and editing projects with forms that accept text fields and file uploads.
- Visualizes project status (Ongoing vs Past) clearly for users.
- Handles multipart/form-data requests for image and PDF uploads during create/update operations.
