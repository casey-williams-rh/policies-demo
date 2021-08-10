import { Page, useTransformQueryResponse } from '@redhat-cloud-services/insights-common-typescript';
import { validatedResponse, validationResponseTransformer } from 'openapi2typescript';
import { useQuery } from 'react-fetching-library';

import { Operations } from '../generated/Openapi';
import { toPolicies } from '../types/adapters/PolicyAdapter';

export const actionCreator = (page?: Page) => Operations.GetPolicies.actionCreator(page?.toQuery() ?? {});

const decoder = validationResponseTransformer((response: Operations.GetPolicies.Payload) => {
    if (response.type === 'PagedResponseOfPolicy') {
        return validatedResponse(
            response.type,
            response.status,
            {
                data: toPolicies(response.value),
                count: response.value.meta?.count || 0
            },
            response.errors
        );
    }

    return response;
});

export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean) => {
    return useTransformQueryResponse(
        useQuery(actionCreator(page), initFetch),
        decoder
    );
};

const policiesToBooleanDecoder = validationResponseTransformer((response: Operations.GetPolicies.Payload) => {
    let hasPolicies = true;
    if (response.type === 'PagedResponseOfPolicy') {
        hasPolicies = !!response.value.data?.length;
    }

    return validatedResponse(
        'HasPolicies',
        response.status,
        hasPolicies,
        response.errors
    );
});

export const hasPoliciesQueryActionCreator = () => Operations.GetPolicies.actionCreator((Page.of(1, 1).toQuery()));

export const useHasPoliciesQuery = () => {
    return useTransformQueryResponse(
        useQuery(hasPoliciesQueryActionCreator(), false),
        policiesToBooleanDecoder
    );
};
