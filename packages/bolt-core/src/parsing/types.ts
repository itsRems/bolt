export type ZodParser<Input> = {
  parse: (input: any) => Input;
};

export type CustomParser<Input> = (input: any) => Input | Promise<Input>;

export type SingleInputParser<Input> = ZodParser<Input> | CustomParser<Input>;

export type ZodIOParser<Input, Output> = {
  _input: Input;
  _output: Output;
};

export type MultiInputParser<Input, Output> = ZodIOParser<Input, Output>;

export type Parser = MultiInputParser<any, any> | SingleInputParser<any>;

export type inferParser<TParser extends Parser> = TParser extends MultiInputParser<infer $TIn, infer $TOut>
  ? {
      in: $TIn;
      out: $TOut;
    }
  : TParser extends SingleInputParser<infer $TIn>
  ? {
      in: $TIn;
      out: $TIn;
    }
  : never;
