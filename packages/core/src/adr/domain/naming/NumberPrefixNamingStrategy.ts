import slugify from "slugify";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { PackageRef } from "../PackageRef";

/**
 * A naming strategy that uses incremental numbers as prefix.
 * Format: NNNN-slugified-title (where NNNN is zero-padded)
 * Example: 0001-use-microservices-architecture
 */
export class NumberPrefixNamingStrategy implements AdrNamingStrategy {
  private getNextNumber: (packageRef?: PackageRef) => number;

  constructor(getNextNumber: (packageRef?: PackageRef) => number) {
    this.getNextNumber = getNextNumber;
  }

  generateSlug(title: string, packageRef?: PackageRef): string {
    const slugifiedTitle = slugify(title, {
      lower: true,
      strict: true
    }).replace(/-*$/, "");

    const nextNumber = this.getNextNumber(packageRef);
    const localSlug = `${nextNumber
      .toString()
      .padStart(4, "0")}-${slugifiedTitle}`;

    return packageRef ? `${packageRef.name}/${localSlug}` : localSlug;
  }

  // eslint-disable-next-line class-methods-use-this
  getDisplayName(): string {
    return "Number Prefix (0001-title)";
  }

  // eslint-disable-next-line class-methods-use-this
  getStrategyId(): string {
    return "number-prefix";
  }
}
