import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import Image from 'next/image';

function ImageDropzone({ handleImageTobase64, image, loading }) {
	return (
		<Dropzone
			className='max-w-sm w-full h-full border-2 border-dashed border-gray-300 rounded-lg'
			onDrop={handleImageTobase64}
			accept={IMAGE_MIME_TYPE}
			maxFiles={1}
			loading={loading}
		>
			<Group
				justify='center'
				gap='xl'
				mih={220}
				style={{ pointerEvents: 'none' }}
			>
				<Dropzone.Accept>
					<IconUpload
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-blue-6)',
						}}
						stroke={1.5}
					/>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<IconX
						style={{
							width: rem(52),
							height: rem(52),
							color: 'var(--mantine-color-red-6)',
						}}
						stroke={1.5}
					/>
				</Dropzone.Reject>
				<Dropzone.Idle>
					{image ? (
						<Image src={image} alt='uploaded image' width={400} height={400} />
					) : (
						<IconPhoto
							style={{
								width: rem(52),
								height: rem(52),
								color: 'var(--mantine-color-dimmed)',
							}}
							stroke={1.5}
						/>
					)}
				</Dropzone.Idle>

				<div>
					<Text size='xl' inline>
						Drag images here or click to select files
					</Text>
				</div>
			</Group>
		</Dropzone>
	);
}

export default ImageDropzone;
