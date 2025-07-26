import moment from "moment";
import slugify from "slugify";
import { AdrNamingStrategy } from "./AdrNamingStrategy";
import { PackageRef } from "../PackageRef";

/**
 * The default naming strategy that uses date prefix.
 * Format: YYYYMMDD-slugified-title
 * Example: 20240115-use-microservices-architecture
 */
export class DatePrefixNamingStrategy implements AdrNamingStrategy {
  // eslint-disable-next-line class-methods-use-this
  generateSlug(title: string, packageRef?: PackageRef, date?: Date): string {
    const slugifiedTitle = slugify(title, {
      lower: true,
      strict: true
    }).replace(/-*$/, "");

    const currentDate = date || new Date();
    const localSlug = `${moment(currentDate).format(
      "YYYYMMDD"
    )}-${slugifiedTitle}`;

    return packageRef ? `${packageRef.name}/${localSlug}` : localSlug;
  }

  // eslint-disable-next-line class-methods-use-this
  getDisplayName(): string {
    return "Date Prefix (YYYYMMDD-title)";
  }

  // eslint-disable-next-line class-methods-use-this
  getStrategyId(): string {
    return "date-prefix";
  }
}
