const express = require('express');
const settings = require('./config/settings');
const apiRoutes = require('./api/endpoints');

const app = express();
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// IMPORTANT: This logic prevents the port clash during testing
if (require.main === module) {
    app.listen(settings.PORT, () => {
        console.log(`Server running on port ${settings.PORT}`);
    });
}

// THIS IS THE KEY LINE FOR SUPERTEST
module.exports = app;