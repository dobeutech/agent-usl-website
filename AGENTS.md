## Learned User Preferences

## Learned Workspace Facts

- Production site is deployed on Netlify at https://unique-staffing-professionals.netlify.app.
- GitHub remote for this project is `dobeutech/agent-usl-website`.
- There is no `/composio` directory in the repo; Composio/Rube-style workflows are driven through Cursor MCP servers, not checked-in paths.
- The browser tests workflow uses branches `main` and `develop` for pull requests and `develop` for push (not `dev`).
- `src/dd-rum.ts` depends on `@datadog/browser-rum` and `@datadog/browser-logs`; keep them installed so `npx tsc --noEmit` resolves imports (use `npm install` with `--legacy-peer-deps`).
