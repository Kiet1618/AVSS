import NewNode from './newNode.interface'
import Point from './point.interface'

export default interface Node extends NewNode {
    finalShare: bigint,
    listShare: Array<Point>
    publicKey: string,
}
