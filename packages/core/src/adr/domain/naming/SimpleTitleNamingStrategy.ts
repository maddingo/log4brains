import slugify from "slugify";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { PackageRef } from "../PackageRef";

/**
 * A simple naming strategy that uses only the slugified title.
 * Format: slugified-title
 * Example: use-microservices-architecture
 */
export class SimpleTitleNamingStrategy implements AdrNamingStrategy {
  // eslint-disable-next-line class-methods-use-this
  generateSlug(title: string, packageRef?: PackageRef): string {
    const slugifiedTitle = slugify(title, {
      lower: true,
      strict: true
    }).replace(/-*$/, "");

    return packageRef ? `${packageRef.name}/${slugifiedTitle}` : slugifiedTitle;
  }

  // eslint-disable-next-line class-methods-use-this
  getDisplayName(): string {
    return "Simple Title (title-only)";
  }

  // eslint-disable-next-line class-methods-use-this
  getStrategyId(): string {
    return "simple-title";
  }
}
