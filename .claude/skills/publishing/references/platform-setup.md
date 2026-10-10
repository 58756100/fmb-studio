# One-time platform setup (all free)

## Instagram (Graph API)
1. On developers.facebook.com create an app (type: Business) and add the Instagram product ("Instagram API with Facebook Login").
2. Give it these permissions: instagram_basic, instagram_content_publish, instagram_manage_insights, pages_show_list, pages_read_engagement.
3. In Graph API Explorer, generate a user token for the Page linked to the IG account, exchange it for a long-lived token (60 days), and read the IG user id with `/me/accounts?fields=instagram_business_account`.
4. Save IG_USER_ID and IG_ACCESS_TOKEN as API credentials on the studio's cloud environment. The analyst flags the token 7 days before it expires.

## YouTube (Data API v3 + Analytics API)
1. In console.cloud.google.com create a project and enable YouTube Data API v3 and YouTube Analytics API.
2. Set up the OAuth consent screen (External, add yourself as a test user), then create an OAuth client of type Desktop.
3. Run the one-time consent flow (Claude can walk you through it) for the scopes youtube.upload, youtube.readonly and yt-analytics.readonly, and keep the refresh token.
4. Save YT_CLIENT_ID, YT_CLIENT_SECRET and YT_REFRESH_TOKEN as API credentials.
Note: the default quota is about 10,000 units a day, and an upload costs about 1,600, so 6 Shorts a day fit.

## TikTok (Content Posting API)
1. On developers.tiktok.com create an app, add Login Kit and Content Posting API, and request the video.upload and video.list scopes.
2. Authorize your account once and keep the refresh token.
3. Save TT_CLIENT_KEY, TT_CLIENT_SECRET and TT_REFRESH_TOKEN as API credentials.
Until TikTok audits the app, uploads arrive as inbox drafts, and you tap post.

## Cloud environment (claude.ai/code → environment settings)
- Network access: Custom, keep the default list, and add graph.facebook.com, rupload.facebook.com, oauth2.googleapis.com, www.googleapis.com, youtube.googleapis.com, youtubeanalytics.googleapis.com, open.tiktokapis.com and api.elevenlabs.io.
- API credentials: the variables above plus ELEVENLABS_API_KEYS (comma-separated).
