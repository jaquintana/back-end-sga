{
    "compilerOptions": {
      "module": "commonjs",
      "esModuleInterop": true,
      "target": "es6",
      "moduleResolution": "node",
      "outDir": "dist",
      "forceConsistentCasingInFileNames": true,
      "noFallthroughCasesInSwitch": true,
      "isolatedModules": false,
      "strict": true,
      "noImplicitAny": true,
      "useUnknownInCatchVariables": false,
      "inlineSourceMap": true,
      "baseUrl": ".",
    "paths": {
      "@src/*": ["server/*","server/src/*","server/src/api/routes/*"],
    },   
    },
   "include": ["**/*.ts", "**/*.tsx","server/src/**/*", "./**/*.ts","/**/*.ts"],
    "ts-node": {
        "esm": true,
       
       
    },
    "lib": ["esnext","es2015"]
}