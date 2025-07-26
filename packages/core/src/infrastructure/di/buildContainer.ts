import {
  createContainer,
  asValue,
  InjectionMode,
  asClass,
  AwilixContainer,
  asFunction
} from "awilix";
import { Log4brainsConfig } from "@src/infrastructure/config";
import * as adrCommandHandlers from "@src/adr/application/command-handlers";
import * as adrQueryHandlers from "@src/adr/application/query-handlers";
import { CommandHandler, QueryHandler } from "@src/application";
import { AdrSlug, PackageRef } from "@src/adr/domain";
import { AdrNamingStrategyFactory } from "@src/adr/domain/naming";
import * as repositories from "@src/adr/infrastructure/repositories";
import { CommandBus, QueryBus } from "../buses";
import { FileWatcher } from "../file-watcher";

function lowerCaseFirstLetter(string: string): string {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function buildContainer(
  config: Log4brainsConfig,
  workdir = "."
): AwilixContainer {
  const container: AwilixContainer = createContainer({
    injectionMode: InjectionMode.PROXY
  });

  // Configuration & misc
  container.register({
    config: asValue(config),
    workdir: asValue(workdir),
    fileWatcher: asClass(FileWatcher).singleton()
  });

  // Initialize naming strategy based on configuration
  const initializeNamingStrategy = () => {
    const namingConfig = config.project.naming || {
      strategy: "date-prefix",
      options: {}
    };

    const getNextNumber = (packageRef?: PackageRef): number => {
      const adrRepository = container.resolve<repositories.AdrRepository>(
        "adrRepository"
      );
      return adrRepository.getNextAdrNumber(packageRef);
    };

    const strategy = AdrNamingStrategyFactory.create(namingConfig.strategy, {
      getNextNumber
    });

    AdrSlug.setNamingStrategy(strategy);
  };

  // We need to defer this until after repositories are registered
  container.register({
    initializeNamingStrategy: asFunction(initializeNamingStrategy).singleton()
  });

  // Repositories
  Object.values(repositories).forEach((Repository) => {
    container.register(
      lowerCaseFirstLetter(Repository.name),
      asClass<unknown>(Repository).singleton()
    );
  });

  // Command handlers
  Object.values(adrCommandHandlers).forEach((Handler) => {
    container.register(
      Handler.name,
      asClass<CommandHandler>(Handler).singleton()
    );
  });

  // Command bus
  container.register({
    commandBus: asFunction(() => {
      const bus = new CommandBus();

      Object.values(adrCommandHandlers).forEach((Handler) => {
        const handlerInstance = container.resolve<CommandHandler>(Handler.name);
        bus.registerHandler(handlerInstance, handlerInstance.commandClass);
      });

      return bus;
    }).singleton()
  });

  // Query handlers
  Object.values(adrQueryHandlers).forEach((Handler) => {
    container.register(
      Handler.name,
      asClass<QueryHandler>(Handler).singleton()
    );
  });

  // Query bus
  container.register({
    queryBus: asFunction(() => {
      const bus = new QueryBus();

      Object.values(adrQueryHandlers).forEach((Handler) => {
        const handlerInstance = container.resolve<QueryHandler>(Handler.name);
        bus.registerHandler(handlerInstance, handlerInstance.queryClass);
      });

      return bus;
    }).singleton()
  });

  // Initialize the naming strategy after all dependencies are registered
  container.resolve("initializeNamingStrategy");

  return container;
}
