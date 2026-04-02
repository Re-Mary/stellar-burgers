/** Преобразует BURGER_API_URL (https://host/api) в базовый WebSocket URL (wss://host). */
export const getWsRootUrl = (): string => {
  const apiUrl = process.env.BURGER_API_URL || '';
  return apiUrl
    .replace(/^https:\/\//i, 'wss://')
    .replace(/^http:\/\//i, 'ws://')
    .replace(/\/api\/?$/i, '');
};

export const getPublicFeedWsUrl = (): string => `${getWsRootUrl()}/orders/all`;

export const getUserOrdersWsUrl = (accessToken: string | undefined): string => {
  const base = `${getWsRootUrl()}/orders`;
  if (!accessToken) {
    return base;
  }
  const token = accessToken.replace(/^Bearer\s+/i, '');
  return `${base}?token=${token}`;
};
