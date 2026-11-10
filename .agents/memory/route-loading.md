---
name: Route loading scope
description: Rationale for retaining session initialization during route code splitting.
---

Performance changes to route loading should retain eager session initialization
unless separately scoped to change authentication behavior.

**Why:** This app combines Firebase and Supabase sessions; delaying or relocating
their shared initialization risks changing public-to-private redirects and session
restoration. The first optimization intentionally separates screens rather than
redesigning authentication.

**How to apply:** If further reducing the homepage bundle, treat deferred auth
initialization as a separate behavior change and verify both session providers,
return-path redirects and Google redirect completion.
