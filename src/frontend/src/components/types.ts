/**
 * Base types for all components
 */

interface ComponentPropTypes {
    style?: {
        [key: string]: any
    },
    className?: string,
    'data-testid'?: string
}

interface ComponentWithChildrenPropTypes extends ComponentPropTypes {
    children: React.ReactNode
}

export type {
    ComponentPropTypes,
    ComponentWithChildrenPropTypes
}