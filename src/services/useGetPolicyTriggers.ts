import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validationResponseTransformer } from 'openapi2typescript';
import { useParameterizedQuery } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { toTriggers } from '../types/adapters/TriggerAdapter';
import { Uuid } from '../types/Policy/Policy';

export interface UseGetPolicyTriggersParams {
    policyId: Uuid;
    page: Page;
}

export const actionCreator = (params: UseGetPolicyTriggersParams) => {
    return Operations.GetPoliciesByIdHistoryTrigger.actionCreator({
        id: params.policyId,
        ...params.page.toQuery()
    });
};

export const dataToTriggers = validationResponseTransformer((validatedResponse: Operations.GetPoliciesByIdHistoryTrigger.Payload) => {
    if (validatedResponse.type === 'PagedResponseOfHistoryItem') {
        const value = validatedResponse.value;

        return {
            ...validatedResponse,
            type: 'PagedTriggers' as const,
            value: {
                count: value.meta?.count || 0,
                data: toTriggers(value.data ?? [])
            }
        };
    }

    return validatedResponse;
});

export const useGetPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery(actionCreator),
        dataToTriggers
    );
};

const triggersToBooleanAdapter = validationResponseTransformer((validatedResponse: Operations.GetPoliciesByIdHistoryTrigger.Payload) => {
    if (validatedResponse.type === 'PagedResponseOfHistoryItem') {
        return {
            ...validatedResponse,
            type: 'boolean' as const,
            value: validatedResponse.value.data && validatedResponse.value.data.length
        };
    }

    return validatedResponse;
});

export const hasTriggersQueryActionCreator = (policyId: Uuid) => Operations.GetPoliciesByIdHistoryTrigger.actionCreator({
    id: policyId,
    ...Page.of(1, 1).toQuery()
});

export const useHasPolicyTriggersParametrizedQuery = () => {
    return useTransformQueryResponse(
        useParameterizedQuery(hasTriggersQueryActionCreator),
        triggersToBooleanAdapter
    );
};
