import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://132.145.143.61/graphql',
  documents: ['./app/**/*.ts?(x)'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      }
    }
  },
};

export default config;