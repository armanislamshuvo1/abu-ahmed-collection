# Abu Ahmed Collection — Project TODOs

## Priority: Cloud Image Storage
- [ ] **Migrate image uploads from local disk to Cloudinary or AWS S3**:
  - **Issue**: Render uses an ephemeral filesystem. Any uploaded files saved to `server/uploads/` will be wiped whenever Render restarts, sleeps, or deploys a new commit.
  - **Proposed Solution**:
    1. Install `cloudinary` and `multer-storage-cloudinary` in `server/`.
    2. Configure Cloudinary credentials in `.env` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
    3. Update `server/src/middleware/upload.js` to upload directly to Cloudinary and store the secure HTTPS URL in MongoDB product documents.
    4. Update client image renderers to consume Cloudinary URLs directly.
