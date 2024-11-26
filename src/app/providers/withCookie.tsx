import { CookiesProvider } from 'react-cookie';

export const withCookie = (Component: React.ComponentType) => {
  return function WithCookieComponent(props: any) {
    return (
      <CookiesProvider>
        <Component {...props} />
      </CookiesProvider>
    );
  };
};
