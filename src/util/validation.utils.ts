export type ValidationResult = boolean;
export type ValidationMessage = string;
export type ValidationFieldConfig<T> = (
    value: T,
) => [ValidationResult, ValidationMessage];
export type ValidationObjectConfig<T> = Partial<
    {
        [K in keyof T]:
            | ValidationFieldConfig<T[K]>
            | ValidationFieldConfig<T[K]>[];
    }
>;
export type ValidationConfig<T> = T extends Record<string, unknown>
    ? ValidationObjectConfig<T>
    : ValidationFieldConfig<T> | ValidationFieldConfig<T>[];

export class Validator<T> {
    static requiredDefaultValidationMessage = 'required';
    static minDefaultValidationMessage = 'min';
    static maxDefaultValidationMessage = 'max';
    static formatDefaultValidationMessage = 'format';

    constructor(protected _config: ValidationConfig<T>) {}

    validate(
        source: T,
    ): T extends Record<string, unknown>
        ? ValidationMessage[]
        : ValidationMessage;
    validate(source: Partial<T>, key?: keyof T): ValidationMessage;
    validate(
        source: T,
        key?: keyof T,
    ): ValidationMessage | ValidationMessage[] {
        if (key) {
            return this._validateField(source, key);
        } else if (typeof source === 'object' || typeof source === 'function') {
            const keysToValidate = Object.keys(this._config);
            const validationMessages = keysToValidate
                .map((key) => this._validateField(source, key as keyof T))
                .filter((it) => !!it);
            if (validationMessages.length > 0) {
                return validationMessages;
            }
        } else {
            const fieldConfig = this._config as ValidationFieldConfig<T>;
            return this._validateByFieldConfig(source, fieldConfig);
        }
    }

    toValidationConfig(): ValidationFieldConfig<T> {
        return (source: T) => {
            const validateMessages = this.validate(source);
            const isMessagesArray = Array.isArray(validateMessages);
            return [
                !validateMessages,
                isMessagesArray
                    ? validateMessages[0]
                    : (validateMessages as string),
            ];
        };
    }

    static required(
        message = Validator.requiredDefaultValidationMessage,
    ): ValidationFieldConfig<unknown> {
        return (value) => [!!value, message];
    }

    static min(
        min: number,
        message = Validator.minDefaultValidationMessage,
    ): ValidationFieldConfig<unknown> {
        return (value: number | { length: number }) => {
            if (typeof value === 'number') {
                return [value >= min, message];
            }
            return [value?.length >= min ?? false, message];
        };
    }

    static max(
        max: number,
        message = Validator.maxDefaultValidationMessage,
    ): ValidationFieldConfig<unknown> {
        return (value: number | { length: number }) => {
            if (typeof value === 'number') {
                return [value <= max, message];
            }
            return [value?.length <= max ?? false, message];
        };
    }

    static regexp(
        regexp: RegExp,
        message = Validator.formatDefaultValidationMessage,
    ): ValidationFieldConfig<unknown> {
        return (value: string) => {
            const testResult = regexp.test(value);
            regexp.lastIndex = 0;
            return [testResult, message];
        };
    }

    protected _validateField(source: T, key?: keyof T): ValidationMessage {
        const resolvedConfig = this._config as ValidationObjectConfig<T>;
        const fieldConfig = resolvedConfig[key];
        return this._validateByFieldConfig(source[key], fieldConfig);
    }

    protected _validateByFieldConfig(
        source: unknown,
        fieldConfig:
            | ValidationFieldConfig<unknown>
            | ValidationFieldConfig<unknown>[],
    ): ValidationMessage {
        if (!fieldConfig) {
            return;
        }
        const resolvedFieldConfig = Array.isArray(fieldConfig)
            ? fieldConfig
            : [fieldConfig];
        for (let i = 0; i < resolvedFieldConfig.length; i++) {
            const validator = resolvedFieldConfig[i];
            const [validationResult, validationMessage] = validator(
                source as T,
            );
            if (!validationResult) {
                return validationMessage;
            }
        }
    }
}
