import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';

import { ActionType } from '../../../../types/Policy/Actions';
import { PolicyExporterCsv } from '../Csv';

describe('src/utils/exporters/Policy/Csv', () => {
    it('has csv type', () => {
        const exporter = new PolicyExporterCsv();
        expect(exporter.type).toEqual(ExporterType.CSV);
    });

    it('has text/csv type', () => {
        const result = new PolicyExporterCsv().export([]);
        expect(result.type).toEqual('text/csv');
    });

    it('has 9 columns', () => {
        const result = new PolicyExporterCsv().export([
            {
                id: '12345',
                name: 'hello world',
                description: 'my description',
                conditions: 'arch = x86_64',
                isEnabled: false,
                lastTriggered: new Date(2030, 5, 5),
                actions: [
                    {
                        type: ActionType.NOTIFICATION
                    }
                ],
                ctime: new Date(2030, 5, 4),
                mtime: new Date(2030, 5, 6)
            }
        ]);

        const reader = new FileReader();
        return new Promise<void>((done, fail) => {
            reader.addEventListener('loadend', () => {
                try {
                    const text = (reader.result as string).split('\r');
                    expect(text[0]).toEqual('id,name,description,isEnabled,conditions,actions,lastTriggered,mtime,ctime');
                    done();
                } catch (ex) {
                    fail(ex);
                }
            });
            reader.readAsText(result);
        });
    });

    // No way to compare blobs yet
    // https://github.com/facebook/jest/issues/7372
    it('empty export has the headers', () => {
        const result = new PolicyExporterCsv().export([]);
        expect(result.size).toBeGreaterThan(0);
    });
});
