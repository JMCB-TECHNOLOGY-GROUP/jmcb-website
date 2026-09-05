// ============================================================
// src/lib/model-json.ts — pull the JSON object out of a model reply.
//
// The model routes ask for "ONLY JSON", and mostly get it, but a reply can
// still arrive wrapped in a code fence, prefixed with a sentence, or with
// trailing commentary. Stripping fences and parsing the whole string, as the
// routes used to, throws on any of those and the applicant sees a generic
// "we couldn't make sense of that". This takes the outermost {...} instead.
//
// It does NOT repair truncated JSON. A reply cut off at max_tokens is a
// different failure with a different fix (check stop_reason, raise the cap),
// and patching it here would hide that.
// ============================================================

export class ModelJsonError extends Error {}

/** The first complete top-level JSON object in `text`, parsed. Throws when there is none. */
export function extractJsonObject(text: string): unknown {
  const s = String(text ?? "");
  const start = s.indexOf("{");
  if (start === -1) throw new ModelJsonError("no JSON object in model reply");

  // Walk to the matching close brace, honouring strings and escapes, so a
  // "}" inside a quoted value does not end the object early.
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(s.slice(start, i + 1));
        } catch (e) {
          throw new ModelJsonError(`model JSON did not parse: ${(e as Error).message}`);
        }
      }
    }
  }
  throw new ModelJsonError("model JSON object never closed (truncated reply?)");
}
