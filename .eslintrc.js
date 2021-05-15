/* eslint-disable quote-props */
module.exports = {
  'env': {
    'browser': true,
    'node': true
  },
  'parser': '@typescript-eslint/parser',
  'extends': [
    'xo-space',
    'plugin:angular/bestpractices'
  ],
  'plugins': [
    'eslint-plugin-import',
    '@angular-eslint/eslint-plugin',
    '@typescript-eslint'
  ],
  'rules': {
    // Permito numero ilimitado de parametros ya que es muy comun en las injection de los servicios en los controladores
    'max-params': ['off'],

    // Desactivo porque tiene confilctos con los decoradores de Angular
    'new-cap': ['off'],

    'max-nested-callbacks': ['error', {
      'max': 8
    }],

    'no-negated-condition': ['off'],

    'no-unused-vars': ['off'],

    'no-useless-constructor': ['off'],

    'no-async-promise-executor': ['off'],

    'object-curly-spacing': ['error', 'always'],

    'no-irregular-whitespace': ['off'],

    'no-warning-comments': ['off']
  }
};
