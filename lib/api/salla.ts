export const sallaApi = {
    connect: async (apiKey: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (apiKey === 'error') {
            throw new Error('Invalid API Key');
        }

        return {
            id: 'salla-123',
            name: 'My Salla Store',
            platform: 'Salla',
            status: 'connected',
        };
    },

    getProducts: async () => {
        return [
            { id: '1', name: 'Product A', price: 100 },
            { id: '2', name: 'Product B', price: 200 },
        ];
    }
};
