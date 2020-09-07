export type ValidationResult = boolean;
export type ValidationMessage = string;
export type ValidationFieldConfig<T> =
    | ((value: T) => [ValidationResult, ValidationMessage])
    | ((value: T) => [ValidationResult, ValidationMessage])[];
export type ValidationObjectConfig<T> = Partial<
    {
        [K in keyof T]: ValidationFieldConfig<T[K]>;
    }
>;
export type ValidationConfig<T> = T extends Record<string, unknown>
    ? ValidationObjectConfig<T>
    : ValidationFieldConfig<T>;

export class Validator<T> {
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
            return validationMessages.length > 0 && validationMessages;
        } else {
            const fieldConfig = this._config as ValidationFieldConfig<T>;
            return this._validateByFieldConfig(source, fieldConfig);
        }
    }

    toValidationConfig(): ValidationFieldConfig<T> {
        return (source: T) => {
            const validateMessages = this.validate(source);
            const isMessagesArray = Array.isArray(validateMessages);
            const isValid =
                (isMessagesArray && validateMessages.length > 0) ||
                !!validateMessages;
            return [
                isValid,
                isMessagesArray
                    ? validateMessages[0]
                    : (validateMessages as string),
            ];
        };
    }

    protected _validateField(source: T, key?: keyof T): ValidationMessage {
        const resolvedConfig = this._config as ValidationObjectConfig<T>;
        const fieldConfig = resolvedConfig[key];
        return this._validateByFieldConfig(source[key], fieldConfig);
    }

    protected _validateByFieldConfig(
        source: unknown,
        fieldConfig: ValidationFieldConfig<unknown>,
    ): ValidationMessage {
        const resolvedFieldConfig = Array.isArray(fieldConfig)
            ? fieldConfig
            : [fieldConfig];
        for (let i = 0; i < resolvedFieldConfig.length; i++) {
            const validator = resolvedFieldConfig[i];
            const [validationResult, validationMessage] = validator(
                source as T,
            );
            if (validationResult) {
                return validationMessage;
            }
        }
    }
}
