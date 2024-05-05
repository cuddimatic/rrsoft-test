import { Article } from "../types/Article";

export function validateArticle(article: Article): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!article.title.trim()) {
    errors.title = 'Title is required';
  } else if (article.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!article.body.trim()) {
    errors.body = 'Body is required';
  } else if (article.body.length < 10) {
    errors.body = 'Body must be at least 10 characters long';
  }

  if (article.contactInfo.trim() && !/^\d+(?:[- ])?\d+(?:[- ])?\d+$/.test(article.contactInfo)) {
    errors.contactInfo = 'Invalid phone number format';
  }

  return errors;
}
