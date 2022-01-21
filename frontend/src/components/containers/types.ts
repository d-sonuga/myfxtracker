import {ComponentWithChildrenPropTypes} from '@components/types'

interface ContainerPropTypes extends ComponentWithChildrenPropTypes {
    onKeyPress?: Function
}

interface CenterBoxPropTypes extends ContainerPropTypes {
    alignItemsCenter?: boolean
}

export type {
    ContainerPropTypes,
    CenterBoxPropTypes
}
