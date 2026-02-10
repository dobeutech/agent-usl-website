// src/edge-functions/prerender-middleware.mts
var acceptContentTypes = ["text/html", "text/plain", "*/*"];
var excludedUAs = [" Googlebot/", " bingbot/", " Amazonbot/", " Petalbot;", " GoogleOther", "AppleBot/"];
var prerender_middleware_default = async (req, context) => {
  const originalUserAgent = req.headers.get("User-Agent") || "";
  if (excludedUAs.some((e) => originalUserAgent.includes(e))) {
    console.log(`Prerender middleware called by user-agent: "${originalUserAgent}" which runs Javascript, skipping prerendering`);
    return;
  }
  const clientIp = req.headers.get("X-Forwarded-For") || context.ip || "";
  const url = new URL(req.url);
  let logMessage = `Prerender middleware called for path: ${url.pathname}, user-agent: "${originalUserAgent}", IP: ${clientIp}`;
  const acceptHeader = req.headers.get("Accept");
  if (acceptHeader && acceptHeader.trim() !== "") {
    if (!acceptContentTypes.some((e) => acceptHeader.includes(e))) {
      logMessage += `, but accept header is "${acceptHeader}", skipping`;
      console.log(logMessage);
      return;
    }
  }
  console.log(logMessage);
  const authToken = Netlify.env.get("NETLIFY_PRERENDER_AUTH_TOKEN")?.trim();
  if (!authToken) {
    console.warn("NETLIFY_PRERENDER_AUTH_TOKEN is not configured - skipping");
    return;
  }
  if (req.headers.has("authorization")) {
    console.warn("Reuqest has an authorization header set, not pre-rendering");
    return;
  }
  const prerenderUrl = new URL("/netlify-prerender-function", url.origin);
  prerenderUrl.searchParams.set("url", url.toString());
  const headers = {
    "User-Agent": "Netlify-Prerender-Extension",
    "X-Forwarded-For": clientIp,
    "X-Prerender-Token": authToken.trim()
  };
  try {
    return context.next(new Request(prerenderUrl.toString(), {
      method: "GET",
      headers
    }));
  } catch (error) {
    console.error("Error calling prerender function:", error);
    return;
  }
};
var config = {
  // Only paths with no extension, or .html/.htm
  // eslint-disable-next-line no-useless-escape
  pattern: ["^.*/[^.]*$", "^.*.html$", "^.*.htm$"],
  excludedPattern: [
    "^/netlify-prerender-function.*$",
    // Exclude development paths of Vite/React
    "^/@.*$",
    // Exclude common framework and API paths
    // eslint-disable-next-line no-useless-escape
    "^/(api|_next|_nuxt|_astro|_serverFn|static|_ipx|.netlify)/.*$"
  ],
  method: "GET",
  header: {
    // Match only relevant UA categories (set in edge)
    "netlify-agent-category": "^(ai-agent|page-preview|crawler)(;.*)?$"
  },
  onError: "bypass",
  name: "Netlify Prerender Middleware"
  // name attribute is valid, but not yet exposed in type.
};
export {
  config,
  prerender_middleware_default as default
};
