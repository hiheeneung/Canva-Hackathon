import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the YAML file
const swaggerYamlPath = path.join(__dirname, '../../swagger.yaml');
const swaggerYamlContent = fs.readFileSync(swaggerYamlPath, 'utf8');

// Parse YAML to JavaScript object
const swaggerSpec = yaml.load(swaggerYamlContent);

// Update server URL from environment variable if provided
if (process.env.API_URL) {
  swaggerSpec.servers[0].url = process.env.API_URL;
}

export default swaggerSpec;