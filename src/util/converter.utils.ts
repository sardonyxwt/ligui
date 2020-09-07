/**
 * @abstract Converter
 * @description Converter for one side converting.
 * @example DTO -> POJO
 */
export abstract class Converter<IN, OUT> {
    abstract convert(source: IN): OUT;

    convertArray(sources: IN[]): OUT[] {
        return sources.map(this.convert);
    }
}

/**
 * @abstract DoubleSidedConverter
 * @description Converter for double side converting.
 * @example DTO <--> POJO
 */
export abstract class DoubleSidedConverter<IN, OUT> extends Converter<IN, OUT> {
    abstract revert(source: OUT): IN;

    revertArray(sources: OUT[]): IN[] {
        return sources.map(this.revert);
    }
}

/**
 * @abstract StraightConverter
 * @description Converter straight converting.
 * @example DTO -> POJO -> MODEL
 */
export abstract class StraightConverter<IN, INTERMEDIATE, OUT = IN> {
    abstract convertTo(source: IN): INTERMEDIATE;
    abstract convertFrom(source: INTERMEDIATE): OUT;

    convertToArray(sources: IN[]): INTERMEDIATE[] {
        return sources.map(this.convertTo);
    }

    convertFromArray(sources: INTERMEDIATE[]): OUT[] {
        return sources.map(this.convertFrom);
    }
}
