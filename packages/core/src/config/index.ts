export interface IGoatExternalProjectConfig {
  name: string;
  version: string;
  locations: {
    icons?: { src: string };
    javascript?: {
      src: string | string[];
    };
    dist: string;
    patterns: { directory: string; pattern: string }[];
  };
  styles: {
    resources: string[];
  };
  handlers: {
    javascript: boolean;
    styles: boolean;
    assets: boolean;
  };
  bundler: {
    clean: boolean;
    destination: {
      flat: boolean;
    };
    js: {
      esm?: boolean;
      output: {
        filename: boolean;
        publicpath: boolean;
      };
    };
  };
  stories: {
    namespaces: {
      [key:string]: string
    };
    static?: string
  };
  icons: {
    fontName: string;
    prefix: string;
    fontDirectory: string;
    generate: {
      woff: true;
      eot: false;
      ttf: false;
      woff2: true;
      preview: true;
      json: true;
      variables: true;
      css: false;
      styles: true;
      selection: true;
      svg: true;
      symbol: true;
    };
  };
}

export interface IGoatInternalProjectConfig {
  goatVersion: string;
  functions: string[],
  modules: {
    name: string,
    package: string,
    description: string,
    global?: boolean,
    default: boolean,
  }[]
}
