# Sandboxed Component iframes

## Packages
 - demo-user-app: the user-built React app to be run in the iframe
 - demo-viewer: renders the outer window and application components; contains the SandboxedIframe component definition
 - near-social-api: API imported into the user React app providing functionality for working in the sandboxed context (e.g. methods for window messaging)

## Installation

```shell
npm i -g pnpm
pnpm i
pnpm run build
```

## Deployment & Execution

### User App Demo
This demo relies on the bundle for the external component being hosted on an external
(i.e. non-localhost) domain. The `js-external-bundles-ns` S3 bucket is used as a hosting
solution currently; to use this you will need the `.env` file at the project root with AWS
access keys for an account permitted to upload to that bucket. When using the established
S3 bucket, be sure to change references to the bucket prefix currently hardcoded to `andy-demo`
to ensure that your demo does not overwrite someone else's.

To build the bundle locally, run:
```shell
cd packages/demo-user-app
pnpm run build
```

To build and deploy to S3, run:
```shell
cd packages/demo-user-app
pnpm run deploy
```

NB that the bundle does not need to be hosted in S3, feel free to use any hosting solution
which makes the bundle accessible behind a CORS policy. Only the URL references should need
to be changed.

### Viewer Demo
The outer viewer was created from `create-react-app` and so can be run locally by running:
```shell
cd packages/demo-viewer
pnpm run start
```
