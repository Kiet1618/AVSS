import { BN } from 'bn.js';
import * as EC from 'elliptic';
import * as crypto from 'crypto';

//frontend generate PRIVATE KEY
// console.log('Initial state PRIVATE KEY:');
const ecInstance = new EC.ec('secp256k1');
// const priKey: BN = new BN(crypto.randomBytes(64).toString('hex'), 'hex').umod(ecInstance.n);
// console.log(priKey.toString());

//index
const nodeIndex: BN[] = [
    new BN(1),
    new BN(2),
    new BN(3),
    new BN(4),
    new BN(5),
];

//functions
function generateSharesLagrangeInterpolation(shares: BN[], nodeIndex: BN[], priKey: BN): BN {
    let index = 0;
    let secret = new BN(0);
    for (let i = index; i <= shares.length; i += 1) {
        let upper = new BN(1);
        let lower = new BN(1);
        for (let j = index; j <= shares.length; j += 1) {
            if (i !== j) {
                upper = upper.mul(nodeIndex[j].neg());
                let temp = nodeIndex[i].sub(nodeIndex[j]);
                lower = lower.mul(temp);
            }
        }
        let delta = upper.div(lower);
        if (i == shares.length) {
            index++;
            let delta2 = priKey.sub(secret);
            let share = delta2.div(delta);
            return share.umod(ecInstance.n);
        }
        delta = delta.mul(shares[i]);
        secret = secret.add(delta);
    }
}

const shares = () => {
    const priKey: BN = new BN(crypto.randomBytes(64).toString('hex'), 'hex').umod(ecInstance.n);
    let temp: BN[] = [new BN(crypto.randomBytes(64).toString('hex'), 'hex').umod(ecInstance.n), new BN(crypto.randomBytes(64).toString('hex'), 'hex').umod(ecInstance.n)];
    temp[2] = generateSharesLagrangeInterpolation(temp, nodeIndex, priKey);
    temp[3] = generateSharesLagrangeInterpolation(temp, nodeIndex, priKey);
    temp[4] = generateSharesLagrangeInterpolation(temp, nodeIndex, priKey);
    temp[5] = priKey;
    return temp;
};

// console.log(nodeIndex);
// console.log(shares.map(x => x.toString('hex')));

export { shares };


