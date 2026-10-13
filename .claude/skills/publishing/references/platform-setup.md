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

## TikTok (Content Posting API, Sandbox)
1. App "fmb app" on developers.tiktok.com, Sandbox "fmb", target user @fuelmybuild. Products: Login Kit (redirect `https://fuelmybuild.com/tiktok-callback`) and Content Posting API. Scopes: user.info.basic, video.upload, video.publish.
2. Refresh token: open the authorize link with the Sandbox client key, approve, then exchange the `code` from the landing address at `POST https://open.tiktokapis.com/v2/oauth/token/` (grant_type=authorization_code, same redirect_uri). The code expires within minutes. Refresh tokens last about a year.
3. Save TT_CLIENT_KEY, TT_CLIENT_SECRET and TT_REFRESH_TOKEN (Sandbox values) as environment variables.
Limits verified 2026-10-13: inbox drafts work; captions sent with a draft are ignored (TikTok pre-fills a tag from the app name); max 5 pending drafts per 24 h; 6 requests/min per token; Direct Post from an unaudited app fails with `unaudited_client_can_only_post_to_private_accounts`. Production approval needs a user-facing TikTok feature on fuelmybuild.com plus a demo video, so it is not pursued for internal posting.

## Cloud environment (claude.ai/code → environment settings)
- Network access: Custom, keep the default list, and add graph.facebook.com, rupload.facebook.com, oauth2.googleapis.com, www.googleapis.com, youtube.googleapis.com, youtubeanalytics.googleapis.com, open.tiktokapis.com and api.elevenlabs.io.
- API credentials: the variables above plus ELEVENLABS_API_KEYS (comma-separated).
