import { createNewLiguiInstance } from '../src/ligui';

describe('Ligui test', () => {

    it('createNewLiguiInstance', () => {
        createNewLiguiInstance({
            name: 'TestLigui',
            containerOptions: {
                skipBaseClassChecks: true
            },
            moduleScopeOptions: {
                initState: {
                    modules: []
                }
            },
            resourceScopeOptions: {
                initState: {
                    resources: []
                }
            },
            internationalizationScopeOptions: {
                initState: {
                    currentLocale: 'en',
                    defaultLocale: 'en',
                    locales: ['en'],
                    translateUnits: []
                }
            }
        })
    });

});
