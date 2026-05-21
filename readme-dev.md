# Sovendus-Integration-Types Developer guide

Our typescript types for the integration. This package is used in the scripts and in the plugins/components.

## Sovendus packages used

### sovendus-release-tool

This package is used to handle publishing, testing, linting, and building the package.

[github.com/Sovendus-GmbH/sovendus-release-tool](https://github.com/Sovendus-GmbH/sovendus-release-tool)

### sovendus-builder

A wrapper around vite to simplify and standardize the build process. It is used to bundle the package.

[github.com/Sovendus-GmbH/sovendus-builder](https://github.com/Sovendus-GmbH/sovendus-builder)

## Contributing

If you want to contribute or report issues, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to your fork.
4. Create a pull request to the main repository and make sure all tests pass.

## Building from Source

To build the project from source, run:

```bash
yarn install
# either with:
yarn build
# or with:
yarn pub
```

## Linting & Tests

To run linting and tests, use:

```bash
# either with:
yarn lint
# or with:
yarn pub
```

## Publishing

1. If you have no access to the repository, fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push your branch to your fork.
4. Create a pull request to the main repository.
5. If you have access to the repository, you can publish a new version by running:

    ```bash
    yarn pub
    ```
