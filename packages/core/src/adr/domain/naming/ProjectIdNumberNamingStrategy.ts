import slugify from "slugify";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { PackageRef } from "../PackageRef";

/**
 * A naming strategy that uses project ID and incremental numbers.
 * Format: PROJECT_ID-number-slugified-title
 * Example: FRONTEND-1-use-microservices-architecture
 */
export class ProjectIdNumberNamingStrategy implements AdrNamingStrategy {
  private getNextNumber: (packageRef?: PackageRef) => number;

  private getProjectId: (packageRef?: PackageRef) => string;

  constructor(dependencies: {
    getNextNumber: (packageRef?: PackageRef) => number;
    getProjectId: (packageRef?: PackageRef) => string;
  }) {
    this.getNextNumber = dependencies.getNextNumber;
    this.getProjectId = dependencies.getProjectId;
  }

  generateSlug(title: string, packageRef?: PackageRef): string {
    const slugifiedTitle = slugify(title, {
      lower: true,
      strict: true
    }).replace(/-*$/, "");

    const projectId = this.getProjectId(packageRef).toUpperCase();
    const number = this.getNextNumber(packageRef);
    const localSlug = `${projectId}-${number}-${slugifiedTitle}`;

    return packageRef ? `${packageRef.name}/${localSlug}` : localSlug;
  }

  // eslint-disable-next-line class-methods-use-this
  getDisplayName(): string {
    return "Project ID + Number (PROJ-1-title)";
  }

  // eslint-disable-next-line class-methods-use-this
  getStrategyId(): string {
    return "project-id-number";
  }
}
