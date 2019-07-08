import Koa from "koa";
import {ILogger} from "oddlog";

export interface IHelloControllerDependencies {
  logger: ILogger;
}

export class HelloController {
  private logger: ILogger;

  constructor(dependencies: IHelloControllerDependencies) {
    this.logger = dependencies.logger;
  }

  public async get(ctx: Koa.Context) {
    this.logger.debug("received get request");
    ctx.body = "Hello world!";
  }
}
