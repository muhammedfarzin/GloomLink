import keywordExtractor from "keyword-extractor";
import lemmatizer from "wink-lemmatizer";

export function extractKeywords(text: string) {
  let keywords = keywordExtractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });

  return keywords.map((word) => lemmatizer.noun(word)); // Lemmatizing only nouns
}
