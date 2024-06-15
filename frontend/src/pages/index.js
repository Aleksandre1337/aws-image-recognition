import ReturnedData from '@/components/ReturnedData';
import UploadForm from '@/components/UploadForm';
import Head from 'next/head';
import { useState } from 'react';

export default function HomePage() {
	const [data, setData] = useState([]);

	return (
		<>
			<Head>
				<title>Image Recognition</title>
			</Head>
			<UploadForm setData={setData} />
			<ReturnedData data={data} />
		</>
	);
}
