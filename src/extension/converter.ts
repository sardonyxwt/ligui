export abstract class Converter<IN, OUT> {

  abstract convert(source: IN): OUT;

  convertArray(sources: IN[]): OUT[] {
    return sources.map(this.convert);
  }

}

export abstract class DoubleSidedConverter<IN, OUT> extends Converter<IN, OUT> {

  abstract revert(source: OUT): IN;

  revertArray(sources: OUT[]): IN[] {
    return sources.map(this.revert);
  }

}
