import { builderFactory } from './entity';

export class Vector2 {
  x = 0;
  y = 0;

  static builder = builderFactory(Vector2);
}

export class Vector3 {
  x = 0;
  y = 0;
  z = 0;

  static builder = builderFactory(Vector3);
}
