# RPLS
Utility for copying templates with variable substitution and replacement

## Install
```shell
npm i -D rpls
```

## Post install
- After install, add command to npm scripts:
```shell
# package.json
{
  ...
  "scripts": {
    "rpls": "./node_modules/rpls/bin/cli.js"
  },
  ...
}
```

## Options
```shell
Options:
      --tpl      Template directory                          [string] [required]
      --outDir   Out directory                                          [string]
      --rw       Rewrite string. Example: <fromString>:<toString>
                                                              [array] [required]
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```



## Use Example
```shell
npm run rpls -- --tpl ./my-template --rw fromString1:toString1 --rw fromString2:toString2
```