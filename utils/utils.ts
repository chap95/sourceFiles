export const getParamsString = <T>(value: T, exceptionKeys?: string[]) => {
  let params = '';

  Object.keys(value).map((key: string, index: number) => {
    if ((value as any)[key] === null || (value as any)[key] === undefined) {
      delete (value as any)[key];
    }

    if (exceptionKeys && exceptionKeys.indexOf(key) !== -1) {
      delete (value as any)[key];
    }
  });

  Object.keys(value).map((key: string, index: number) => {
    const currentParams =
      index === 0 ? `${key}=${(value as any)[key]}` : `&${key}=${(value as any)[key]}`;
    params += currentParams;
  });

  return params;
};
