import slugify from "slugify";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { PackageRef } from "../PackageRef";

/**
 * A naming strategy that uses project ID and incremental numbers.
 * Each project ID maintains its own number sequence starting from 1.
 * Format: PROJECT_ID-number-slugified-title
 * Example: FRONTEND-1-use-microservices-architecture
 */
export class ProjectIdNumberNamingStrategy implements AdrNamingStrategy {
  private getExistingFiles: (packageRef?: PackageRef) => string[];

  private getProjectId: (packageRef?: PackageRef) => string;

  constructor(dependencies: {
    getExistingFiles: (packageRef?: PackageRef) => string[];
    getProjectId: (packageRef?: PackageRef) => string;
  }) {
    this.getExistingFiles = dependencies.getExistingFiles;
    this.getProjectId = dependencies.getProjectId;
  }

  private getNextNumberForProjectId(
    projectId: string,
    packageRef?: PackageRef
  ): number {
    const files = this.getExistingFiles(packageRef);
    let maxNumber = 0;

    files.forEach((filename) => {
      // Extract project ID and number from filename: PROJECT_ID-number-title.md
      // Remove .md extension first
      const baseFilename = filename.replace(/\.md$/, "");
      const match = /^([A-Z_]+)-(\d+)-/.exec(baseFilename);
      if (match) {
        const fileProjectId = match[1];
        const number = parseInt(match[2], 10);
        // Only consider files with the same project ID
        if (fileProjectId === projectId && number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    return maxNumber + 1;
  }

  generateSlug(title: string, packageRef?: PackageRef): string {
    const slugifiedTitle = slugify(title, {
      lower: true,
      strict: true
    }).replace(/-*$/, "");

    const projectId = this.getProjectId(packageRef).toUpperCase();
    const number = this.getNextNumberForProjectId(projectId, packageRef);
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
