type TSPrimitives = BooleanConstructor | NumberConstructor | StringConstructor | ArrayConstructor;
type SupportedTypes = TSPrimitives;

interface FieldDefinition<T extends SupportedTypes> {
  type: T;
  required?: boolean;
  default?: InstanceType<T> | { value: InstanceType<T>; override: boolean };
}

interface SchemaDefinition {
  [key: string]: FieldDefinition<SupportedTypes> | [FieldDefinition<SupportedTypes>];
}

const Model = (definition: SchemaDefinition) => {
  return class Model {
    json: any;
    constructor(json: any) {
      this.json = json;
    }
  };
};

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

const ModelExample = Model({
  field1: { type: Number, required: true },
  field2: { type: String, required: true, default: "hello" },
  field3: { type: String, required: true, default: { value: "bye", override: true } },
  field4: [{ type: Number }],
});
