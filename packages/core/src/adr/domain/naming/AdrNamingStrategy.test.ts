import { DatePrefixNamingStrategy } from "./DatePrefixNamingStrategy";
import { NumberPrefixNamingStrategy } from "./NumberPrefixNamingStrategy";
import { ProjectIdNumberNamingStrategy } from "./ProjectIdNumberNamingStrategy";
import { SimpleTitleNamingStrategy } from "./SimpleTitleNamingStrategy";
import { AdrNamingStrategyFactory } from "./AdrNamingStrategyFactory";
import { PackageRef } from "../PackageRef";

describe("AdrNamingStrategy", () => {
  describe("DatePrefixNamingStrategy", () => {
    const strategy = new DatePrefixNamingStrategy();

    it("should generate slug with date prefix", () => {
      const date = new Date("2024-01-15");
      const slug = strategy.generateSlug(
        "Use Microservices Architecture",
        undefined,
        date
      );

      expect(slug).toBe("20240115-use-microservices-architecture");
    });

    it("should include package reference when provided", () => {
      const date = new Date("2024-01-15");
      const packageRef = new PackageRef("backend");
      const slug = strategy.generateSlug(
        "Use Microservices Architecture",
        packageRef,
        date
      );

      expect(slug).toBe("backend/20240115-use-microservices-architecture");
    });

    it("should provide correct strategy info", () => {
      expect(strategy.getDisplayName()).toBe("Date Prefix (YYYYMMDD-title)");
      expect(strategy.getStrategyId()).toBe("date-prefix");
    });
  });

  describe("NumberPrefixNamingStrategy", () => {
    const mockGetNextNumber = jest.fn();
    const strategy = new NumberPrefixNamingStrategy(mockGetNextNumber);

    beforeEach(() => {
      mockGetNextNumber.mockClear();
    });

    it("should generate slug with number prefix", () => {
      mockGetNextNumber.mockReturnValue(1);
      const slug = strategy.generateSlug("Use Microservices Architecture");

      expect(slug).toBe("0001-use-microservices-architecture");
      expect(mockGetNextNumber).toHaveBeenCalledWith(undefined);
    });

    it("should zero-pad numbers correctly", () => {
      mockGetNextNumber.mockReturnValue(42);
      const slug = strategy.generateSlug("Use Database Sharding");

      expect(slug).toBe("0042-use-database-sharding");
    });

    it("should include package reference when provided", () => {
      mockGetNextNumber.mockReturnValue(1);
      const packageRef = new PackageRef("backend");
      const slug = strategy.generateSlug(
        "Use Microservices Architecture",
        packageRef
      );

      expect(slug).toBe("backend/0001-use-microservices-architecture");
      expect(mockGetNextNumber).toHaveBeenCalledWith(packageRef);
    });

    it("should provide correct strategy info", () => {
      expect(strategy.getDisplayName()).toBe("Number Prefix (0001-title)");
      expect(strategy.getStrategyId()).toBe("number-prefix");
    });
  });

  describe("ProjectIdNumberNamingStrategy", () => {
    const mockGetNextNumber = jest.fn();
    const mockGetProjectId = jest.fn();
    const strategy = new ProjectIdNumberNamingStrategy({
      getNextNumber: mockGetNextNumber,
      getProjectId: mockGetProjectId
    });

    beforeEach(() => {
      mockGetNextNumber.mockClear();
      mockGetProjectId.mockClear();
    });

    it("should generate slug with uppercase project ID and number", () => {
      mockGetProjectId.mockReturnValue("ADR");
      mockGetNextNumber.mockReturnValue(1);
      const slug = strategy.generateSlug("Use Microservices Architecture");

      expect(slug).toBe("ADR-1-use-microservices-architecture");
      expect(mockGetProjectId).toHaveBeenCalledWith(undefined);
      expect(mockGetNextNumber).toHaveBeenCalledWith(undefined);
    });

    it("should convert project ID to uppercase", () => {
      mockGetProjectId.mockReturnValue("frontend");
      mockGetNextNumber.mockReturnValue(42);
      const slug = strategy.generateSlug("Add User Authentication");

      expect(slug).toBe("FRONTEND-42-add-user-authentication");
    });

    it("should include package reference when provided", () => {
      mockGetProjectId.mockReturnValue("backend");
      mockGetNextNumber.mockReturnValue(5);
      const packageRef = new PackageRef("api");
      const slug = strategy.generateSlug("Implement GraphQL API", packageRef);

      expect(slug).toBe("api/BACKEND-5-implement-graphql-api");
      expect(mockGetProjectId).toHaveBeenCalledWith(packageRef);
      expect(mockGetNextNumber).toHaveBeenCalledWith(packageRef);
    });

    it("should use ADR as default project ID", () => {
      mockGetProjectId.mockReturnValue("ADR");
      mockGetNextNumber.mockReturnValue(5);
      const slug = strategy.generateSlug("Add Authentication System");

      expect(slug).toBe("ADR-5-add-authentication-system");
    });

    it("should provide correct strategy info", () => {
      expect(strategy.getDisplayName()).toBe(
        "Project ID + Number (PROJ-1-title)"
      );
      expect(strategy.getStrategyId()).toBe("project-id-number");
    });
  });

  describe("SimpleTitleNamingStrategy", () => {
    const strategy = new SimpleTitleNamingStrategy();

    it("should generate slug with only title", () => {
      const slug = strategy.generateSlug("Use Microservices Architecture");

      expect(slug).toBe("use-microservices-architecture");
    });

    it("should include package reference when provided", () => {
      const packageRef = new PackageRef("backend");
      const slug = strategy.generateSlug(
        "Use Microservices Architecture",
        packageRef
      );

      expect(slug).toBe("backend/use-microservices-architecture");
    });

    it("should provide correct strategy info", () => {
      expect(strategy.getDisplayName()).toBe("Simple Title (title-only)");
      expect(strategy.getStrategyId()).toBe("simple-title");
    });
  });

  describe("AdrNamingStrategyFactory", () => {
    it("should create DatePrefixNamingStrategy", () => {
      const strategy = AdrNamingStrategyFactory.create("date-prefix");

      expect(strategy).toBeInstanceOf(DatePrefixNamingStrategy);
    });

    it("should create NumberPrefixNamingStrategy with dependencies", () => {
      const getNextNumber = jest.fn().mockReturnValue(1);
      const strategy = AdrNamingStrategyFactory.create("number-prefix", {
        getNextNumber
      });

      expect(strategy).toBeInstanceOf(NumberPrefixNamingStrategy);
    });

    it("should throw error for NumberPrefixNamingStrategy without dependencies", () => {
      expect(() => {
        AdrNamingStrategyFactory.create("number-prefix");
      }).toThrow(
        "NumberPrefixNamingStrategy requires getNextNumber dependency"
      );
    });

    it("should create SimpleTitleNamingStrategy", () => {
      const strategy = AdrNamingStrategyFactory.create("simple-title");

      expect(strategy).toBeInstanceOf(SimpleTitleNamingStrategy);
    });

    it("should create ProjectIdNumberNamingStrategy with dependencies", () => {
      const getNextNumber = jest.fn().mockReturnValue(1);
      const getProjectId = jest.fn().mockReturnValue("test");
      const strategy = AdrNamingStrategyFactory.create("project-id-number", {
        getNextNumber,
        getProjectId
      });

      expect(strategy).toBeInstanceOf(ProjectIdNumberNamingStrategy);
    });

    it("should throw error for ProjectIdNumberNamingStrategy without dependencies", () => {
      expect(() => {
        AdrNamingStrategyFactory.create("project-id-number");
      }).toThrow(
        "ProjectIdNumberNamingStrategy requires getNextNumber and getProjectId dependencies"
      );
    });

    it("should throw error for unknown strategy", () => {
      expect(() => {
        AdrNamingStrategyFactory.create("unknown-strategy");
      }).toThrow("Unknown ADR naming strategy: unknown-strategy");
    });

    it("should return available strategies", () => {
      const strategies = AdrNamingStrategyFactory.getAvailableStrategies();

      expect(strategies).toEqual([
        "date-prefix",
        "number-prefix",
        "simple-title",
        "project-id-number"
      ]);
    });
  });
});
