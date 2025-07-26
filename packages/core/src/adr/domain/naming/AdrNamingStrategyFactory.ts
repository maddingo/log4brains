import { Log4brainsError } from "@src/domain";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { DatePrefixNamingStrategy } from "./DatePrefixNamingStrategy";
import { NumberPrefixNamingStrategy } from "./NumberPrefixNamingStrategy";
import { SimpleTitleNamingStrategy } from "./SimpleTitleNamingStrategy";
import { PackageRef } from "../PackageRef";

export interface AdrNamingStrategyFactoryDependencies {
  /**
   * Function to get the next available number for number-prefix strategy.
   * Should return the next incremental number for the given package.
   */
  getNextNumber?: (packageRef?: PackageRef) => number;
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

      default:
        throw new Log4brainsError(
          `Unknown ADR naming strategy: ${strategyName}. Available strategies: date-prefix, number-prefix, simple-title`
        );
    }
  }

  /**
   * Returns all available strategy identifiers.
   */
  static getAvailableStrategies(): string[] {
    return ["date-prefix", "number-prefix", "simple-title"];
  }
}
