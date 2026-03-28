const express = require('express');
const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'test ok' }));
app.listen(4001, () => console.log('Test server on 4001'));
