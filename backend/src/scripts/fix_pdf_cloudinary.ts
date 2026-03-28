import { prisma } from '../db';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

// PARSE CREDENTIALS 
if (!process.env.CLOUDINARY_URL) {
  console.error("CLOUDINARY_URL not found in .env");
  process.exit(1);
}
const url = process.env.CLOUDINARY_URL;
const [auth, cloudName] = url.replace('cloudinary://', '').split('@');
const [apiKey, apiSecret] = auth.split(':');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

async function fixSpecificPDF() {
  console.log("--- Fixing PDF ID 5 ---");

  const localPath = path.resolve(__dirname, '../../resources/lecture_notes/resource_5_1746391983.pdf');
  
  if (!fs.existsSync(localPath)) {
    console.error("Local file not found!");
    return;
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "raw",
      folder: "juris_resources",
      use_filename: true,
      unique_filename: true
    });

    console.log(`Success! Fixed URL: ${uploadResult.secure_url}`);

    await prisma.resource.update({
      where: { id: 5 },
      data: { file_path: uploadResult.secure_url }
    });
  } catch (error) {
    console.error("Failed to fix PDF:", error);
  }

  console.log("--- Fix Completed ---");
}

fixSpecificPDF()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
