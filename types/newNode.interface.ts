import Point from './point.interface'
import BN from 'bn.js'
export default interface NewNode {
    nodeIndex: number,
    secret: BN,
    listSecretShare: Array<Point>,
}
