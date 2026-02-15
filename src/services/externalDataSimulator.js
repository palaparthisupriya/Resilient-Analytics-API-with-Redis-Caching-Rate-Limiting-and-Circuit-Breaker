const settings = require('../config/settings');

class ExternalDataSimulator {
    async fetchData() {
        return new Promise((resolve, reject) => {
            // Simulate a slight network delay
            setTimeout(() => {
                const isFailure = Math.random() < settings.EXTERNAL_SERVICE_FAILURE_RATE;

                if (isFailure) {
                    reject(new Error("External Service Failure"));
                } else {
                    resolve({
                        data: "External system online",
                        value: Math.random() * 100
                    });
                }
            }, 50); // 50ms simulated latency
        });
    }
}

module.exports = new ExternalDataSimulator();