export enum Operator {
    Equals = 0,
    NotEquals = ~Equals,
    GreaterThan = 1,
    LessThanOrEqual = ~GreaterThan,
    LessThan = 2,
    GreaterThanOrEqual = ~LessThan,
    Between = 3,
    NotBetween = ~Between,
    In = 4,
    NotIn = ~In,
    StartsWith = 5,
    NotStartsWith = ~StartsWith,
    EndsWith = 6,
    NotEndsWith = ~EndsWith,
    Contains = 7,
    NotContains = ~Contains,
}