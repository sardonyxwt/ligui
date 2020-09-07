/**
 * @interface PathProps
 * @description Path props. Define path functionality.
 * If parent defined create tree path definition.
 */
export interface PathProps<
    T1 extends Record<string, unknown> = Record<string, unknown>,
    T2 extends Record<string, unknown> = Record<string, unknown>
> {
    /**
     * @field path
     * @description Path path template
     * @example "/client/:role/:id?"
     */
    readonly path?: string;

    /**
     * @field build
     * @description Build path template function.
     * @default "() => path".
     */
    readonly build?: (props: T1) => string;

    /**
     * @field parent
     * @description Parent path node.
     * @example Parent node client. Child node client info.
     */
    readonly parent?: Path<T2>;
}

/**
 * @class Path
 * @description React router define path system.
 * Api url define system.
 */
export class Path<
    T1 extends Record<string, unknown> = Record<string, unknown>,
    T2 extends Record<string, unknown> = Record<string, unknown>
> {
    public readonly path?: string;
    private readonly selfBuild?: (props: T1) => string;
    private readonly parent?: Path<T2>;

    constructor(
        path?: string,
        build?: (props: T1) => string,
        parent?: Path<T2>,
    );
    constructor(props?: PathProps<T1, T2>);
    constructor(
        props: string | PathProps<T1, T2> = {},
        build?: (props: T1) => string,
        parent?: Path<T2>,
    ) {
        if (typeof props === 'string') {
            this.path = props || '';
            this.selfBuild = build || (() => props);
            this.parent = parent;
        }
        if (typeof props === 'object') {
            this.path = props.path || '';
            this.selfBuild = props.build || (() => props.path);
            this.parent = props.parent;
        }
    }

    public build(props: T1 & T2): string {
        const parentUrl = this.parent ? this.parent.selfBuild(props) : '';
        return `${parentUrl}/${this.selfBuild(props)}`.replace('//', '/');
    }
}
