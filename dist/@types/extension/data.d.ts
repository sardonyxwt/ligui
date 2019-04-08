export declare class Vector2 {
    x: any;
    y: any;
    constructor(x?: number, y?: number);
    static builder: (x?: number, y?: number) => import("./entity").Builder<Vector2>;
}
export declare class Vector3 {
    x: any;
    y: any;
    z: any;
    constructor(x?: number, y?: number, z?: number);
    static builder: (x?: number, y?: number, z?: number) => import("./entity").Builder<Vector3>;
}
export declare type Parameters<T> = T extends (...args: infer T) => any ? T : never;
export declare type ConstructorParameters<T> = T extends new (...args: infer T) => any ? T : never;
export declare type ReturnType<T> = T extends (...args: any[]) => infer T ? T : never;
export declare type ConstructorReturnType<T> = T extends new (...args: any[]) => infer T ? T : never;
