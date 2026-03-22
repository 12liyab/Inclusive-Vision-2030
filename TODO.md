# MongoDB Backend Setup TODO

## Plan Steps:
- [x] 1. Update package.json: Add mongoose dependency
- [x] 2. Create/update .env with MONGO_URI and PORT
- [x] 3. Update server.js: Add mongoose, DB connect, Submission model, refactor /api/submit to save to DB
- [x] 4. Run `npm install`
- [x] 5. Test: `npm start`, submit form, verify DB save
- [x] 6. Optional: Test GET /api/submissions

## All Steps Complete ✅

**FULLY COMPLETE** ✅

**Local:** localhost:3000 - Frontend + Backend integrated, form saves to MongoDB.submissions.

**Render:** render.yaml ready:
- Web service: npm install → npm start
- Set MONGO_URI in Render dashboard
- Health: /health ✓

**Test:** Submit form → success, check /api/submissions.

Deployment ready!
