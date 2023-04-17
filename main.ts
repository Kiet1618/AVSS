import { pvss } from './utils/verify';
import testData from './utils/createDataNode';

const result = pvss(testData);

console.log(testData);
if (result) {
    console.log(
        'Verify Successfully'
    )
}
else {
    console.log('Verify Failure')
}
