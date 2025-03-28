const BaseNodeExecutor = require('./BaseNodeExecutor');

class ConditionalExecutor extends BaseNodeExecutor {
  constructor() {
    super('conditional');
  }

  async execute(input, config, context) {
    const { field, operator, value } = config;

    if (!field || !operator) {
      throw new Error('Conditional node requires "field" and "operator" in config');
    }

    const fieldValue = input[field];
    let conditionMet = false;

    switch (operator) {
      case 'equals':
        conditionMet = fieldValue == value;
        break;
      case 'not_equals':
        conditionMet = fieldValue != value;
        break;
      case 'greater_than':
        conditionMet = Number(fieldValue) > Number(value);
        break;
      case 'less_than':
        conditionMet = Number(fieldValue) < Number(value);
        break;
      case 'contains':
        conditionMet = String(fieldValue).includes(String(value));
        break;
      case 'exists':
        conditionMet = fieldValue !== undefined && fieldValue !== null;
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }

    return {
      conditionMet,
      field,
      operator,
      inputValue: fieldValue,
      comparedValue: value,
      message: conditionMet
        ? `Condition passed: ${field} ${operator} ${value}`
        : `Condition failed: ${field} ${operator} ${value}`,
    };
  }
}

module.exports = ConditionalExecutor;
