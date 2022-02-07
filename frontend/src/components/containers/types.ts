import {ComponentWithChildrenPropTypes} from '@components/types'

interface ContainerPropTypes extends ComponentWithChildrenPropTypes {
}

interface CenterBoxPropTypes extends ContainerPropTypes {
    alignItemsCenter?: boolean
}

export type {
    ContainerPropTypes,
    CenterBoxPropTypes
}
