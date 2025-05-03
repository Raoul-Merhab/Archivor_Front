import connectMongoDB from '@/utils/connectMongoDB';
import { Folder } from '@/models';

export async function GET() {
  await connectMongoDB();

  try {
    const folders = await Folder.find();
    return new Response(JSON.stringify(folders), { status: 200 });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch folders' }), { status: 500 });
  }
}

export async function POST(req) {
  await connectMongoDB();

  try {
    const { name, description } = await req.json();
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const newFolder = await Folder.create({ name, description });
    return new Response(JSON.stringify(newFolder), { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return new Response(JSON.stringify({ error: 'Failed to create folder' }), { status: 500 });
  }
}