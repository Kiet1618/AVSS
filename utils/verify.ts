import { BN } from 'bn.js';
import Node from '../types/node.interface';
import * as EC from 'elliptic';
const ec = new EC.ec("secp256k1");



function lagrangeInterpolation(shares: BN[], nodeIndex: BN[]): BN | null {
    if (shares.length !== nodeIndex.length) {
        return null;
    }
    let secret = new BN(0);
    for (let i = 0; i < shares.length; i += 1) {
        let upper = new BN(1);
        let lower = new BN(1);
        for (let j = 0; j < shares.length; j += 1) {
            if (i !== j) {
                upper = upper.mul(nodeIndex[j].neg());
                upper = upper.umod(ec.n);
                let temp = nodeIndex[i].sub(nodeIndex[j]);
                temp = temp.umod(ec.n);
                lower = lower.mul(temp).umod(ec.n);
            }
        }
        let delta = upper.mul(lower.invm(ec.n)).umod(ec.n);
        delta = delta.mul(shares[i]);
        secret = secret.add(delta);
    }
    return secret.umod(ec.n);
}


export function avss(dataNodes: Array<Node>): boolean {
    for (let i = 0; i < dataNodes.length; i++) {
        let currentNode = dataNodes[i];
        let listShares = [];
        let listNodeIndex = [];
        for (let j = 0; j < dataNodes.length; j++) {
            if (dataNodes[j] !== currentNode) {
                listShares.push(dataNodes[j].listShare[i].value);
                listNodeIndex.push(new BN(dataNodes[j].listShare[i].index))
            }
        }
        let caculateSecret = lagrangeInterpolation(listShares, listNodeIndex);
        let proof = signMessageWithSecretNode('test', caculateSecret.toString(16));
        let newProof = signMessageWithSecretNode('test', currentNode.secret.toString(16));
        if (!compareSignature(proof, newProof)) {
            return false;
        }
    }
    return true;
}

const signMessageWithSecretNode = (message: string, secret: string) => {
    let key = ec.keyFromPrivate(secret, 'hex');
    let signature = key.sign(message);
    let signatureHex = signature.toDER('hex');
    return signatureHex as string;;
}
const compareSignature = (signatureHex1: string, signatureHex2: string): boolean => {
    if (signatureHex1 === signatureHex2) {
        return true;
    }
    else {
        return false;
    }
}