// Test if Professor class instances are shared or separate
const Professor1 = require('./models/Professor');
const Professor2 = require('./models/Professor');

console.log('🧪 Testing Professor class instance sharing...\n');

console.log('Professor1 === Professor2:', Professor1 === Professor2);
console.log('Professor1.useMock:', Professor1.useMock);
console.log('Professor2.useMock:', Professor2.useMock);

Professor1.useMock = true;
console.log('\nAfter setting Professor1.useMock = true:');
console.log('Professor1.useMock:', Professor1.useMock);
console.log('Professor2.useMock:', Professor2.useMock);
