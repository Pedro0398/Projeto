// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./firebase');
const admin = require('firebase-admin');
const PORT = process.env.PORT || 3000

// Habilitar CORS
app.use(cors());
app.use(express.json());

app.use(express.json());

// Rota para listar produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const produtosRef = db.collection('products');
    const snapshot = await produtosRef.get();
    
    const produtos = [];
    snapshot.forEach(doc => {
      produtos.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(produtos);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao buscar produtos');
  }
});

// Rota para adicionar produto
app.post('/api/produtos', async (req, res) => {
  try {
    const { name, ref, img } = req.body;
    
    if (!name || !ref) {
      return res.status(400).json({ erro: 'Nome e referência são obrigatórios' });
    }
    
    const docRef = await db.collection('products').add({
      name,
      ref,
      img: img || 'NA',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      id: docRef.id,
      name,
      ref,
      img: img || 'NA'
    });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send('Erro ao adicionar produto');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});