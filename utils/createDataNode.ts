import { BN } from 'bn.js';
import * as EC from 'elliptic';
import Node from '../types/node.interface'
import { shares } from './generateShare';
import NewNode from '../types/newNode.interface';
import Point from '../types/point.interface';
const ec = new EC.ec('secp256k1');

const createDataNode = () => {
    let listNewNodes: Array<NewNode> = [];
    let listNodes: Array<Node> = [];

    for (let i = 0; i < 6 - 1; i++) {
        const data = shares();
        let rawNode: NewNode = {
            nodeIndex: i + 1,
            secret: data.at(5),
            listSecretShare: [
                {
                    index: 1,
                    value: data[0],
                } as Point,
                {
                    index: 2,
                    value: data[1],
                } as Point,
                {
                    index: 3,
                    value: data[2],
                } as Point,
                {
                    index: 4,
                    value: data[3],
                } as Point,
                {
                    index: 5,
                    value: data[4],
                } as Point,
            ],
        }
        listNewNodes.push(rawNode)
    }
    for (let i = 0; i < 6 - 1; i++) {
        let tempListShare: Array<Point> = new Array(5);
        let tempFinalShare: Array<BN> = new Array(5);

        for (let j = 0; j < 5; j++) {
            const point = listNewNodes[j].listSecretShare.find(point => point.index === i + 1);
            if (point) {
                tempListShare[j] = point;
                tempFinalShare[j] = new BN(point.value);
            }
        }

        tempFinalShare = tempFinalShare.map((_, k) => {
            let shareFound = false;
            for (let l = 0; l < 5; l++) {
                if (tempListShare[l] && tempListShare[l].index === k + 1) {
                    tempFinalShare[k] = new BN(tempListShare[l].value);
                    shareFound = true;
                    break;
                }
            }
            if (!shareFound) {
                for (let l = 0; l < 5; l++) {
                    if (l === i) {
                        continue;
                    }
                    const share = listNewNodes[l].listSecretShare.find(point => point.index === k + 1);
                    if (share) {
                        tempFinalShare[k] = tempFinalShare[k].add(new BN(share.value));
                    }
                }
            }
            return tempFinalShare[k];
        });
        let priKey = tempFinalShare[i].toString(16);
        let privateKey = Buffer.from(priKey, 'hex');
        let keyPair = ec.keyFromPrivate(privateKey);
        let publicKey = keyPair.getPublic('hex');

        listNodes.push({
            nodeIndex: listNewNodes[i].nodeIndex,
            secret: listNewNodes[i].secret,
            listSecretShare: listNewNodes[i].listSecretShare,
            listShare: tempListShare,
            finalShare: tempFinalShare[i],
            publicKey: publicKey,
        } as Node);
    }
    // console.log(listNodes[1].listShare);
    // console.log(listNodes[1].listSecretShare);
    return listNodes;
}
const testData = createDataNode();

export default testData;
