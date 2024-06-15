import { List } from '@mantine/core';
import React from 'react';

function ReturnedData({ data }) {
	return (
		<>
			{data.length ? (
				<>
					<List
						className='max-w-[300px] rounded-lg backdrop-blur-lg overflow-hidden'
						p={8}
					>
						<List.Item>Result: </List.Item>
						{data.map((item, index) => {
							const [key, value] = Object.entries(item)[0];
							return (
								<List.Item key={index}>
									{key}: {value}
								</List.Item>
							);
						})}
					</List>
				</>
			) : null}
		</>
	);
}

export default ReturnedData;
