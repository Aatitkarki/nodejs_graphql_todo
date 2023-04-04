const { faker } = require('@faker-js/faker');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/mydb'; // Replace with your MongoDB URI
const client = new MongoClient(uri, { useUnifiedTopology: true });

const batchSize = 1000;
const numDocuments = 1000000;
const collectionName = 'salary'; // Replace with your collection name

const generateFakeDocument = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  age: faker.datatype.number({ min: 18, max: 65 }),
  email: faker.internet.email(),
//   phone: faker.phone.phoneNumber(),
  address: {
    // street: faker.address.streetName(),
    city: faker.address.city(),
    state: faker.address.state(),
    zipCode: faker.address.zipCode(),
    country: faker.address.country(),
  },
//   company: faker.company.companyName(),
  jobTitle: faker.name.jobTitle(),
  department: faker.commerce.department(),
  salary: faker.datatype.number({ min: 10000, max: 10000000 }),
  hireDate: faker.date.past(),
  isManager: faker.datatype.boolean(),
  isActive: faker.datatype.boolean(),
  skills: [faker.random.word(), faker.random.word(), faker.random.word()],
  interests: [faker.random.word(), faker.random.word(), faker.random.word()],
  education: [
    {
      degree: faker.random.word(),
    //   institution: faker.company.companyName(),
      completed: faker.datatype.boolean(),
      yearCompleted: faker.datatype.number({ min: 1990, max: 2023 }),
    },
    {
      degree: faker.random.word(),
    //   institution: faker.company.companyName(),
      completed: faker.datatype.boolean(),
      yearCompleted: faker.datatype.number({ min: 1990, max: 2023 }),
    },
  ],
});

async function insertFakeDocuments() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection(collectionName);
 const startTime = Date.now();
    const fakeDocuments = [];
    for (let i = 0; i < numDocuments; i++) {
      const fakeDocument = generateFakeDocument();
      fakeDocuments.push(fakeDocument);

      if (fakeDocuments.length === batchSize) {
        await collection.insertMany(fakeDocuments);
        fakeDocuments.length = 0;
      }
    }

    if (fakeDocuments.length > 0) {
      await collection.insertMany(fakeDocuments);
    }
   const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    console.log(`${numDocuments} fake documents inserted into ${collectionName} in ${elapsedTime} ms.`);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

insertFakeDocuments();
