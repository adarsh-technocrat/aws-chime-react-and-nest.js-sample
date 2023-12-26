export function useQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);

  const getQueryParamValue = (paramName: string) => {
    return queryParams.get(paramName);
  };

  const setQueryParamValue = (paramName: string, paramValue: string) => {
    queryParams.set(paramName, paramValue);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const removeQueryParam = (paramName: string) => {
    queryParams.delete(paramName);
    const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  return { getQueryParamValue, setQueryParamValue, removeQueryParam };
}
