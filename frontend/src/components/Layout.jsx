import React from 'react';

function Layout({ children }) {
	return (
		<main className='h-full px-8 md:px-16 py-8 flex flex-col gap-8'>
			{children}
		</main>
	);
}

export default Layout;
