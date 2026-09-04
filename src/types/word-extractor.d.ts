// word-extractor ships no types. Only the surface we use is declared here.
declare module "word-extractor" {
  class Document {
    getBody(): string;
    getFootnotes(): string;
    getHeaders(): string;
  }
  class WordExtractor {
    extract(input: string | Buffer): Promise<Document>;
  }
  export default WordExtractor;
}
