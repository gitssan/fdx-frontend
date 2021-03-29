export const SERVER_URL_PRODUCTION = 'https://fdx-server-master.herokuapp.com';
export const SERVER_URL_STAGING = 'https://fdx-server-dev.herokuapp.com';
export const SERVER_URL_DEV = 'http://localhost:3000';

export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const EMAIL_ADDRESS = 'emailAddress';
export const PASSWORD = 'password';
export const CONFIRM_PASSWORD = 'confirmPassword';

export const EMPTY_STRING = '';

export const ROUTE_SIGN_UP = '/signup';
export const ROUTE_MAIN = '/main';

export const SEGMENT_FIRST_NAME = 'firstName';
export const SEGMENT_LAST_NAME = 'lastName';

export const SEGMENT_UPPER_CASE = 'upperCase';
export const SEGMENT_LOWER_CASE = 'lowerCase';
export const SEGMENT_MIN_CHARS = 'minChars';

export const REGEX_LOWER_CASE = /(?=.*[a-z])/;
export const REGEX_UPPER_CASE = /(?=.*[A-Z])/;
export const REGEX_MIN_CHARS = /.{8,}/;

export const REGEX_ALPHA_SPACES = /^[a-zA-ZÀ-ÿ-. ]{2,20}$/;
export const REGEX_ALPHA_DIGITS_SPACES_SPECIAL = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9À-ÿ!@#\$%\^\&*\)\(+=._-]{8,}$/;
// https://emailregex.com/ better than the Angular default
export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
