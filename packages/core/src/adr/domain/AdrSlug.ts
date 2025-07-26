import { Log4brainsError, ValueObject } from "@src/domain";
import { AdrFile } from "./AdrFile";
import { PackageRef } from "./PackageRef";
import { AdrNamingStrategy, DatePrefixNamingStrategy } from "./naming";

type Props = {
  value: string;
};

export class AdrSlug extends ValueObject<Props> {
  private static namingStrategy: AdrNamingStrategy = new DatePrefixNamingStrategy();

  constructor(value: string) {
    super({ value });

    if (this.namePart.includes("/")) {
      throw new Log4brainsError(
        "The / character is not allowed in the name part of an ADR slug",
        value
      );
    }
  }

  /**
   * Sets the global naming strategy to use for ADR slug generation.
   * @param strategy The naming strategy to use
   */
  static setNamingStrategy(strategy: AdrNamingStrategy): void {
    AdrSlug.namingStrategy = strategy;
  }

  /**
   * Gets the current naming strategy.
   */
  static getNamingStrategy(): AdrNamingStrategy {
    return AdrSlug.namingStrategy;
  }

  get value(): string {
    return this.props.value;
  }

  get packagePart(): string | undefined {
    const s = this.value.split("/", 2);
    return s.length >= 2 ? s[0] : undefined;
  }

  get namePart(): string {
    const s = this.value.split("/", 2);
    return s.length >= 2 ? s[1] : s[0];
  }

  static createFromFile(file: AdrFile, packageRef?: PackageRef): AdrSlug {
    const localSlug = file.path.basenameWithoutExtension;
    return new AdrSlug(
      packageRef ? `${packageRef.name}/${localSlug}` : localSlug
    );
  }

  static createFromTitle(
    title: string,
    packageRef?: PackageRef,
    date?: Date
  ): AdrSlug {
    const slug = AdrSlug.namingStrategy.generateSlug(title, packageRef, date);
    return new AdrSlug(slug);
  }
}
