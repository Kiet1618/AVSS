import NewNode from './newNode.interface'
import Point from './point.interface'
import BN from 'bn.js'

export default interface Node extends NewNode {
    finalShare: BN,
    listShare: Array<Point>
    publicKey: string,
}
