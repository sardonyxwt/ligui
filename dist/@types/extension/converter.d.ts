export declare abstract class Converter<IN, OUT> {
    abstract convert(source: IN): OUT;
    convertArray(sources: IN[]): OUT[];
}
export declare abstract class DoubleSidedConverter<IN, OUT> extends Converter<IN, OUT> {
    abstract revert(source: OUT): IN;
    revertArray(sources: OUT[]): IN[];
}
