import { builderFactory } from './entity';

export class Vector2 {
  public x;
  public y;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static builder = builderFactory(Vector2);
}

export class Vector3 {
  public x;
  public y;
  public z;


  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static builder = builderFactory(Vector3);
}

export type Parameters<T> = T extends (... args: infer T) => any ? T : never;
export type ConstructorParameters<T> = T extends new (... args: infer T) => any ? T : never;
export type ReturnType<T> = T extends (... args: any[]) => infer T ? T : never;
export type ConstructorReturnType<T> = T extends new (... args: any[]) => infer T ? T : never;
