// deno-lint-ignore-file
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function slugFromUrl(url: string): string {
  try {
    const u = url.startsWith("http") ? new URL(url) : new URL("https://" + url);
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? u.hostname.split(".")[0];
  } catch {
    return url.split("/").filter(Boolean).pop() ?? "page";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { url, keyword } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "url required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const slug = slugFromUrl(url);
    let title = "";
    let description = "";

    if (apiKey) {
      const prompt = `You write SEO meta tags. URL: ${url}${keyword ? `\nTarget keyword: ${keyword}` : ""}\nReturn ONLY compact JSON: {"title": "...", "description": "..."}\nTitle: max 60 chars, click-worthy, include keyword if given.\nDescription: max 160 chars, one clear sentence, include keyword if given.`;
      try {
        const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (r.ok) {
          const j = await r.json();
          const txt: string = j.choices?.[0]?.message?.content ?? "";
          const m = txt.match(/\{[\s\S]*\}/);
          if (m) {
            const parsed = JSON.parse(m[0]);
            title = String(parsed.title ?? "").slice(0, 200);
            description = String(parsed.description ?? "").slice(0, 400);
          }
        }
      } catch (_e) {
        // fall through
      }
    }

    if (!title) {
      const kw = keyword ? ` — ${keyword}` : "";
      title = `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}${kw}`.slice(0, 60);
    }
    if (!description) {
      description = keyword
        ? `Learn about ${keyword} in this guide. Practical steps and examples for teams shipping today.`
        : `Read our latest post on ${slug.replace(/-/g, " ")}. Practical, no-fluff advice.`;
      description = description.slice(0, 160);
    }

    const result = {
      title,
      description,
      slug,
      current_title: `${slug.replace(/-/g, " ")} - site`,
      current_description: "",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
