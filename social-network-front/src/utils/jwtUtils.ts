import jwtDecode from "jwt-decode";

interface DecodedToken {
  sub: number;
  exp: number;
}

const getToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) {
    removeToken();
    throw new Error("No token found, user is not authenticated.");
  }
  return token;
};

const removeToken = (): void => {
  localStorage.removeItem("token");
};

const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    return null;
  }
};

const isTokenValid = (): boolean => {
  const token = getToken();

  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    removeToken();
    return false;
  }

  return decodedToken.exp * 1000 >= Date.now();
};

const hasToken = (): boolean => {
  return localStorage.getItem("token") !== null;
};

const getIdFromToken = (): number => {
  const token = getToken();

  const decodedToken = decodeToken(token);
  if (!decodedToken) throw new Error("Invalid token");

  return decodedToken.sub;
};

const jwtUtils = {
  getToken,
  removeToken,
  decodeToken,
  isTokenValid,
  hasToken,
  getIdFromToken,
};

export default jwtUtils;
export type { DecodedToken };
