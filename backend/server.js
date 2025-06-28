require('dotenv').config();
const mongoose = require('mongoose');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error);
    process.exit(1);
  }
}

connect();
