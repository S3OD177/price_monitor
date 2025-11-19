export const trendyolApi = {
    connect: async (apiKey: string, apiSecret: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (apiKey === 'error') {
            throw new Error('Invalid Credentials');
        }

        return {
            id: 'trendyol-456',
            name: 'My Trendyol Store',
            platform: 'Trendyol',
            status: 'connected',
        };
    },

    getProducts: async () => {
        return [
            { id: '101', name: 'Trendyol Item X', price: 50 },
            { id: '102', name: 'Trendyol Item Y', price: 75 },
        ];
    }
};
