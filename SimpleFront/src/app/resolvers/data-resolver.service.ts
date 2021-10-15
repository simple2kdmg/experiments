import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

@Injectable()
export class DataResolverService implements Resolve<void> {
  public resolve(): void {
    console.log('some data resolved');
  }
}