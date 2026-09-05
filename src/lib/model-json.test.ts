import { describe, it, expect } from "vitest";
import { extractJsonObject, ModelJsonError } from "./model-json";

describe("extractJsonObject", () => {
  it("parses a bare object", () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
  });

  it("strips a code fence", () => {
    expect(extractJsonObject('```json\n{"a":[1,2]}\n```')).toEqual({ a: [1, 2] });
  });

  it("ignores prose before and after", () => {
    expect(extractJsonObject('Here is the JSON:\n{"ok":true}\nLet me know if you need more.')).toEqual({ ok: true });
  });

  it("does not end early on a brace inside a string", () => {
    expect(extractJsonObject('{"evidence":"Cut costs by 10% {net}","n":2}')).toEqual({
      evidence: "Cut costs by 10% {net}",
      n: 2,
    });
  });

  it("handles escaped quotes inside strings", () => {
    expect(extractJsonObject('{"s":"she said \\"hi\\" }"}')).toEqual({ s: 'she said "hi" }' });
  });

  it("returns the outermost object when objects are nested", () => {
    expect(extractJsonObject('x {"a":{"b":{"c":1}}} y')).toEqual({ a: { b: { c: 1 } } });
  });

  it("throws on a truncated reply rather than guessing", () => {
    expect(() => extractJsonObject('{"skills":[{"value":"Excel","evidence":"Exc')).toThrow(ModelJsonError);
  });

  it("throws when there is no object at all", () => {
    expect(() => extractJsonObject("I cannot read this document.")).toThrow(ModelJsonError);
    expect(() => extractJsonObject("")).toThrow(ModelJsonError);
  });
});
