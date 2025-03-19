export abstract class UseCase {
  abstract execute(command: any): Promise<any>;
}
