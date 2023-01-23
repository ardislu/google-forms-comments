# google-forms-comments

A simple comment system that uses Google Forms and Google Sheets as its backend.

## Creating comments

To create new comments, the frontend directly `POST`s to the Google Form. Since
the `POST` is cross-origin, it is sent in `no-cors` mode and the response is
opaque. The frontend assumes all `POST`s are successful. If the `POST` is
blocked by Google Forms for any reason (e.g. if Google suspects the end-user is
a bot and does a CAPTCHA challenge), then the comment will be silently dropped.

## Reading comments

The `/functions/comments.js` file is a
[Cloudflare Worker](https://workers.cloudflare.com/) that acts as a proxy to
access the Google Sheets API. The Cloudflare Worker injects a service account's
credentials to the API request because the Google Sheets API requires
authorization for _all_ requests, even requests to public spreadsheets.

## Local development

Use the `wrangler` CLI to serve the static frontend and the Cloudflare Worker
proxy at the same time.

1. Copy `.dev.vars.example` and rename the copy to `.dev.vars`. Provide an email
   and private key for a service account with access to the Google Sheet that
   has the form responses.

2. `npx wrangler pages dev .`
