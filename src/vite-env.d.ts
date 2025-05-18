/// <reference types="vite/client" />

type Prettify<T> = {
  [K in keyof T]: T[K];
};
