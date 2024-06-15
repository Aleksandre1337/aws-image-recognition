import { Box, Button, Center, Input, Select, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import ImageDropzone from './ImageDropzone';
import imgToBase64 from '@/utils/imgToBase64';
import { useForm } from '@mantine/form';
import models from '@/constants/models';
import transformData from '@/utils/transformData';

function UploadForm({ setData }) {
	const [loading, setLoading] = useState(false);
	const [image, setImage] = useState(null);
	const form = useForm({
		initialValues: {
			apiKey: '',
			model: models[0].value,
		},
		validationRules: {
			apiKey: (value) => value.trim().length > 0,
			model: (value) => value.trim().length > 0,
		},
	});

	const handleImageTobase64 = async (files) => {
		const base64 = await imgToBase64(files[0]);
		setImage(base64);
	};

	const fetchAwsData = async (e) => {
		try {
			e.preventDefault();

			setLoading(true);

			if (!image.length) {
				return;
			}

			const data = {
				apiToken: form.values.apiKey,
				model: form.values.model,
				base64: image.split(',')[1],
			};

			const response = await fetch('/api/awsRequest', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			const transformedData = transformData(form.values.model, result);

			setData(transformedData);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box className='w-full h-full flex flex-col md:flex-row gap-4 m-auto'>
			<ImageDropzone
				handleImageTobase64={handleImageTobase64}
				image={image}
				loading={loading}
			/>
			<Box className='h-full w-full md:w-auto backdrop-blur-lg p-4 rounded-lg overflow-hidden'>
				<form
					className='flex flex-col w-full items-start justify-center gap-2 md:min-w-[300px]'
					onSubmit={fetchAwsData}
				>
					<TextInput
						className='w-full max-w-[400px]'
						label='API Key'
						placeholder='Enter your API key'
						required
						key={form.key('apiKey')}
						{...form.getInputProps('apiKey')}
					/>
					<Select
						className='w-full max-w-[400px]'
						label='Model'
						placeholder='Select model'
						required
						data={models}
						key={form.key('model')}
						allowDeselect={false}
						{...form.getInputProps('model')}
					/>
					<Button type='submit' loading={loading} disabled={loading}>
						Submit
					</Button>
				</form>
			</Box>
		</Box>
	);
}

export default UploadForm;
