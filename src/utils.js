// match a variable name
// @see https://stackoverflow.com/a/6671856/2124254
//
// 1. Valid variable name start character
// 2. Valid variable name characters after the start
//
//                                   1                             2
//                           ┏━━━━━━━┻━━━━━━━━┓┏━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━┓
// prettier-ignore
export const variableName = '[\\p{L}\\p{Nl}$_#][\\p{L}\\p{Nl}$\\p{Mn}\\p{Mc}\\p{Nd}\\p{Pc}]*';
