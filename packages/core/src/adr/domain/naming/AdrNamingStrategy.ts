import { PackageRef } from "../PackageRef";

export interface AdrNamingStrategy {
  /**
   * Generates a slug from a title, package reference, and optional date.
   * @param title The title of the ADR
   * @param packageRef Optional package reference
   * @param date Optional date (defaults to current date)
   * @returns The generated slug string
   */
  generateSlug(title: string, packageRef?: PackageRef, date?: Date): string;

  /**
   * Returns a human-readable display name for this strategy.
   */
  getDisplayName(): string;

  /**
   * Returns a unique identifier for this strategy.
   */
  getStrategyId(): string;
}
