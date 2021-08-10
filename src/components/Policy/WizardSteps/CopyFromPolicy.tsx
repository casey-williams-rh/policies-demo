import * as React from 'react';
import { useEffectOnce } from 'react-use';

import { Policy } from '../../../types/Policy';
import { PolicyRow, PolicyTable } from '../Table/PolicyTable';
import { PolicyToolbar } from '../TableToolbar/PolicyTableToolbar';
import { CreatePolicyStepContextType } from './CreatePolicyPolicyStep/Context';

type UsedAttributes = 'policyFilter' | 'policyPage' | 'policySort' | 'policyQuery' | 'policyRows';
export interface CopyFromPolicyProps extends Pick<CreatePolicyStepContextType, UsedAttributes>{
    onSelect: (policy: Policy) => void;
}

export const CopyFromPolicy: React.FunctionComponent<CopyFromPolicyProps> = (props) => {

    const {
        policyFilter,
        policyPage,
        policySort,
        policyQuery: getPoliciesQuery,
        policyRows
    } = props;

    useEffectOnce(() => {
        if (!getPoliciesQuery.payload) {
            getPoliciesQuery.query();
        }
    });

    const propsOnSelect = props.onSelect;
    const payload = getPoliciesQuery.payload;
    const policyRowsOnSelect = policyRows.onSelect;

    const onSelectHandler = React.useCallback((policyRow: PolicyRow, index: number, isSelected: boolean) => {
        policyRowsOnSelect(policyRow, index, isSelected);
        if (payload && payload.type === 'PagedResponseOfPolicy' && isSelected) {
            propsOnSelect(payload.value.data[index]);
        }
    }, [ propsOnSelect, policyRowsOnSelect, payload ]);

    const { pageCount, count } = getPoliciesQuery.payload?.type ===  'PagedResponseOfPolicy' ? {
        count: getPoliciesQuery.payload.value.count,
        pageCount: getPoliciesQuery.payload.value.data.length
    } : {
        count: undefined,
        pageCount: undefined
    };

    return (
        <>
            <PolicyToolbar
                ouiaId="copy-from-policy-toolbar"
                onPaginationChanged={ policyPage.changePage }
                page={ policyPage.page.index }
                pageCount={ pageCount }
                perPage={ policyPage.page.size }
                showPerPageOptions={ false }
                hideActions={ true }
                hideBulkSelect={ true }
                filters={ policyFilter.filters }
                setFilters={ policyFilter.setFilters }
                clearFilters={ policyFilter.clearFilter }
                count={ count }
            >
                <PolicyTable
                    ouiaId="copy-from-policy-table"
                    columnsToShow={ [ 'radioSelect', 'name', 'actions' ] }
                    policies={ policyRows.rows }
                    onSelect={ onSelectHandler }
                    loading={ getPoliciesQuery.loading }
                    loadingRowCount={ 5 }
                    onSort={ policySort.onSort }
                    sortBy={ policySort.sortBy }
                    linkToDetailPolicy={ false }
                />
            </PolicyToolbar>
        </>
    );
};
