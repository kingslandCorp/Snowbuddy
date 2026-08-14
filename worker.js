export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "snowbuddy.co.uk") {
      url.hostname = "www.snowbuddy.co.uk";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
