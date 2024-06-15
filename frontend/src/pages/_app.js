import { MantineProvider } from '@mantine/core';
import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps }) {
	return (
		<MantineProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</MantineProvider>
	);
}
