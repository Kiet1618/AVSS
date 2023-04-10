import { BN } from 'bn.js';
import * as EC from 'elliptic';
const ec = new EC.ec("secp256k1");

let nodeIndex = [
    new BN(1),
    // new BN(2),
    //new BN(3),
    new BN(4),
    new BN(5),
];

let shares = [
    new BN("a93fe7a4920c65cf9c735197492bfc8e2524dd9f61bbc58f513a9374607bdba9", "hex"),
    //new BN("da471ed639135e49c75e31d84a972c593ac363f6571754985b09e27dbbd4fa0c", "hex"),
    //new BN("91d46066b682550d4fde0d1d29444efec714b7d9f2989b161ca941bf9cc05fa", "hex"),
    new BN("ccd80a19b0828cff3e6efdc851bc06e0cdc818fd4a924d8728c326fb853bb24b", "hex"),
    new BN("4870316e85e54f4c30a7fe4fa28631fee2e1910ff535bcbdef375e73ef6e9635", "hex"),

];

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
const derivedPrivateKey = lagrangeInterpolation(shares, nodeIndex);
console.log(derivedPrivateKey);
