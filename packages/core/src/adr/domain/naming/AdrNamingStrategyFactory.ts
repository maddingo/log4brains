import { Log4brainsError } from "@src/domain";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { DatePrefixNamingStrategy } from "./DatePrefixNamingStrategy";
import { NumberPrefixNamingStrategy } from "./NumberPrefixNamingStrategy";
import { ProjectIdNumberNamingStrategy } from "./ProjectIdNumberNamingStrategy";
import { SimpleTitleNamingStrategy } from "./SimpleTitleNamingStrategy";
import { PackageRef } from "../PackageRef";

export interface AdrNamingStrategyFactoryDependencies {
  /**
   * Function to get the next available number for number-prefix strategy.
   * Should return the next incremental number for the given package.
   */
  getNextNumber?: (packageRef?: PackageRef) => number;
  /**
   * Function to get existing ADR filenames for project-id-number strategy.
   * Should return an array of filenames for the given package.
   */
  getExistingFiles?: (packageRef?: PackageRef) => string[];
  /**
   * Function to get the project ID for project-id-number strategy.
   * Should return the project identifier for the given package.
   */
  getProjectId?: (packageRef?: PackageRef) => string;
}

export class AdrNamingStrategyFactory {
  /**
   * Creates a naming strategy instance based on the strategy name.
   * @param strategyName The strategy identifier
   * @param dependencies Optional dependencies for strategies that need them
   * @returns The strategy instance
   */
  static create(
    strategyName: string,
    dependencies?: AdrNamingStrategyFactoryDependencies
  ): AdrNamingStrategy {
    switch (strategyName) {
      case "date-prefix":
        return new DatePrefixNamingStrategy();

      case "number-prefix":
        if (!dependencies?.getNextNumber) {
          throw new Log4brainsError(
            "NumberPrefixNamingStrategy requires getNextNumber dependency"
          );
        }
        return new NumberPrefixNamingStrategy(dependencies.getNextNumber);

      case "simple-title":
        return new SimpleTitleNamingStrategy();

      case "project-id-number":
        if (!dependencies?.getExistingFiles || !dependencies?.getProjectId) {
          throw new Log4brainsError(
            "ProjectIdNumberNamingStrategy requires getExistingFiles and getProjectId dependencies"
          );
        }
        return new ProjectIdNumberNamingStrategy({
          getExistingFiles: dependencies.getExistingFiles,
          getProjectId: dependencies.getProjectId
        });

      default:
        throw new Log4brainsError(
          `Unknown ADR naming strategy: ${strategyName}. Available strategies: date-prefix, number-prefix, simple-title, project-id-number`
        );
    }
  }

  /**
   * Returns all available strategy identifiers.
   */
  static getAvailableStrategies(): string[] {
    return [
      "date-prefix",
      "number-prefix",
      "simple-title",
      "project-id-number"
    ];
  }
}
