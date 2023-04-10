import Point from './point.interface'

export default interface NewNode {
    nodeIndex: number,
    secret: bigint,
    listSecretShare: Array<Point>,
}
