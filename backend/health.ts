export async function handler() {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "I am feeling good!",
        }),
    };
}

