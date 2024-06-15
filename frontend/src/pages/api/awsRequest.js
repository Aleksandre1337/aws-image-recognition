export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { body } = req;

		try {
			const response = await fetch(process.env.AWS_API_GATEWAY_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': process.env.AWS_API_GATEWAY_KEY,
				},
				body: JSON.stringify(body),
			});

			const data = await response.json();
			res.status(200).json(data);
		} catch (error) {
			res.status(500).json({ error: 'Error fetching data' });
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
